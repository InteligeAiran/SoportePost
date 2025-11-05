/**
 * Sistema de Asistente Virtual
 * Maneja la interacción con el asistente virtual femenino
 */
const id_usuario_element = document.getElementById("id_user");
let id_usuario = id_usuario_element.value;
let text = null;

    // Agregar esta función al inicio de tu archivo virtual-assistant.js
        function formatNumber(number) {
            if (typeof number !== 'number') return number;
            return number.toFixed(2);
        }

// TUTORIAL DEL DASHBOARD
class TicketManagementTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;
        this.tutorialSteps = [
            {
                selector: '.dashboard-card[data-card="open-tickets"]',
                title: 'Tickets Abiertos',
                description: 'Aquí puedes ver todos los tickets que están abiertos y requieren atención. Este es el punto de partida para la gestión de tickets.',
                position: 'bottom'
            },
            {
                selector: '.dashboard-card[data-card="in-process-tickets"]',
                title: 'Tickets en Proceso',
                description: 'Estos son los tickets que están siendo procesados actualmente por los técnicos. Muestra el progreso activo del trabajo.',
                position: 'top'
            },
            {
                selector: '.dashboard-card[data-card="resolved-tickets"]',
                title: 'Tickets Resueltos',
                description: 'Aquí encuentras los tickets que ya han sido resueltos exitosamente. Representa el trabajo completado del equipo.',
                position: 'left'
            },
            {
                selector: '.dashboard-card[data-card="lab-tickets"]',
                title: 'Tickets en Taller',
                description: 'Los tickets que están en el taller para reparación o mantenimiento físico de equipos.',
                position: 'right'
            },
            {
                selector: '.dashboard-card[data-card="commercial-management"]',
                title: 'Gestión Comercial',
                description: 'Tickets relacionados con gestión comercial y ventas. Incluye procesos de facturación y seguimiento comercial.',
                position: 'bottom'
            },
            {
                selector: '#ticketCountSummaryTable',
                title: 'Estadísticas de Tickets por Módulo',
                description: 'Esta tabla muestra un resumen detallado de todos los tickets organizados por módulo y estado. Te permite ver la distribución completa del trabajo en el sistema.',
                position: 'bottom'
            },
        {
            selector: '#EstatusTallerList',
            title: 'Estatus de Taller',
            description: 'Esta sección muestra el estado actual de todos los equipos en el taller, incluyendo reparaciones en proceso, equipos reparados, pendientes por repuestos, entregados a clientes e irreparables.',
            position: 'bottom'
        },
            {
                selector: '#chart-line',
                title: 'Gráfica de Tickets Mensuales',
                description: 'Esta gráfica muestra la evolución de tickets a lo largo de los meses. Te permite identificar tendencias, picos de trabajo y planificar recursos según la demanda histórica.',
                position: 'top'
            },
            {
                selector: '#ticketsChart',
                title: 'Gráfica de Tickets por Región',
                description: 'Esta gráfica muestra la distribución de tickets por regiones geográficas. Te ayuda a identificar qué regiones requieren más atención y recursos.',
                position: 'top'
            }
        ];
    }

    // Iniciar el tutorial
    startTutorial() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.hideChatbot();
        this.showStep(0);
    }

    // Crear overlay oscuro
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9998;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.overlay);
    }

    // Mostrar paso específico del tutorial
    async showStep(stepIndex) {
        console.log(`🤖 Tutorial: Mostrando paso ${stepIndex + 1} de ${this.tutorialSteps.length}`);
        
        if (stepIndex >= this.tutorialSteps.length) {
            console.log('🤖 Tutorial: Finalizando tutorial - todos los pasos completados');
            this.endTutorial();
            return;
        }

        const step = this.tutorialSteps[stepIndex];
        console.log(`🤖 Tutorial: Buscando elemento para "${step.title}" con selector: ${step.selector}`);
        
        let element = document.querySelector(step.selector);
        
        // Si no se encuentra el elemento, intentar con selectores alternativos
        if (!element) {
            console.log(`🤖 Tutorial: Elemento no encontrado con selector principal, buscando alternativos...`);
            element = this.findAlternativeElement(step);
        }
        
        if (!element) {
            console.warn(`🤖 Tutorial: Elemento no encontrado para "${step.title}". Saltando al siguiente paso.`);
            // Esperar un poco antes de continuar para evitar bucles infinitos
            setTimeout(() => {
                this.nextStep();
            }, 1000);
            return;
        }

        console.log(`🤖 Tutorial: Elemento encontrado para "${step.title}"`);

        // Remover highlight anterior
        this.removeHighlight();

        // Hacer scroll previo si es necesario para elementos en la parte inferior
        await this.prepareElementForHighlight(element);

        // Crear highlight para el elemento actual
        this.highlightElement(element);
        
        // Crear tooltip
        this.createTooltip(element, step);
        
        // Agregar listeners
        this.addStepListeners();
        
        console.log(`🤖 Tutorial: Paso ${stepIndex + 1} configurado correctamente`);
    }
    
    // Buscar elemento alternativo si el selector principal no funciona
    findAlternativeElement(step) {
        const alternativeSelectors = {
            'Gráfica de Tickets Mensuales': [
                '#chart-line',
                'canvas#chart-line',
                '#monthlyTicketsModal',
                '.modal#monthlyTicketsModal',
                '.chart-container canvas:first-of-type',
                '.chart canvas:first-of-type',
                'canvas:first-of-type',
                '.chart:first-of-type canvas',
                '#monthlyTicketsCard canvas'
            ],
            'Gráfica de Tickets por Región': [
                '#ticketsChart',
                'canvas#ticketsChart',
                '.chart-container canvas:last-of-type',
                '.chart canvas:last-of-type',
                'canvas:last-of-type',
                '.chart:last-of-type canvas',
                '#RegionTicketsCard canvas'
            ],
            'Estatus de Taller': [
                '#EstatusTallerList',
                '.card-header.pb-0.p-4.border-b.border-gray-200.bg-gradient-info',
                '.card-header.bg-gradient-info',
                '.card-header:contains("Estatus De Taller")',
                '.card:has(.card-header:contains("Estatus"))',
                '.list-group:has(.list-group-item-custom)',
                '.card-header:contains("Estatus")',
                '.card:has(.list-group)',
                '.list-group-item-custom',
                'h6:contains("Estatus De Taller")',
                '.card:has(h6:contains("Estatus De Taller"))'
            ],
            'Estadísticas de Tickets por Módulo': [
                '#ticketCountSummaryTable',
                'table[id*="ticket"]',
                'table[id*="summary"]',
                '.table-responsive table',
                'table:has(th:contains("Módulo"))'
            ]
        };
        
        const selectors = alternativeSelectors[step.title];
        if (selectors) {
            console.log(`🤖 Tutorial: Buscando selectores alternativos para "${step.title}"`);
            for (const selector of selectors) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        console.log(`🤖 Tutorial: Elemento alternativo encontrado para "${step.title}": ${selector}`);
                        return element;
                    }
                } catch (e) {
                    console.log(`🤖 Tutorial: Error con selector alternativo "${selector}": ${e.message}`);
                }
            }
        }
        
        console.log(`🤖 Tutorial: No se encontraron elementos alternativos para "${step.title}"`);
        return null;
    }
    
    // Preparar elemento para el highlight (scroll previo si es necesario)
    prepareElementForHighlight(element) {
        return new Promise(resolve => {
            // Si el elemento NO está dentro del modal → scroll normal de página
            const modal = document.getElementById('ModalSerial');
            if (!modal || !element.closest('#ModalSerial')) {
        const rect = element.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                if (Math.abs(centerY - viewportCenter) > 100) {
            window.scrollTo({
                        top: window.pageYOffset + centerY - viewportCenter,
                behavior: 'smooth'
            });
                setTimeout(resolve, 800);
                } else {
                    resolve();
                }
                return;
            }

            // === SCROLL DENTRO DEL MODAL ===
            const modalRect = modal.getBoundingClientRect();
            const elRect = element.getBoundingClientRect();

            // Calcular posición del elemento relativa al scroll actual del modal
            const elementTopInModal = elRect.top - modalRect.top + modal.scrollTop;
            const modalVisibleHeight = modal.clientHeight;

            // Si el elemento está fuera del área visible
            if (elementTopInModal < modal.scrollTop || 
                elementTopInModal + elRect.height > modal.scrollTop + modalVisibleHeight) {

                const targetScroll = elementTopInModal - (modalVisibleHeight / 2) + (elRect.height / 2);

                modal.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });

                setTimeout(resolve, 800); // Esperar animación
            } else {
                resolve();
            }
        });
    }

    // Resaltar elemento específico
    highlightElement(element) {
        this.highlightedElement = element;
        
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.id = 'tutorial-highlight';
        highlight.style.cssText = `
            position: fixed;
            top: ${rect.top - 5}px;
            left: ${rect.left - 5}px;
            width: ${rect.width + 10}px;
            height: ${rect.height + 10}px;
            border: 3px solid #007bff;
            border-radius: 8px;
            background: rgba(0, 123, 255, 0.1);
            z-index: 9999;
            pointer-events: none;
            animation: tutorial-pulse 2s infinite;
        `;

        // Agregar animación CSS
        if (!document.getElementById('tutorial-styles')) {
            const style = document.createElement('style');
            style.id = 'tutorial-styles';
            style.textContent = `
                @keyframes tutorial-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(highlight);
    }

    // Crear tooltip informativo
    createTooltip(element, step) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tutorial-tooltip';
        
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 350;
        const tooltipHeight = 140;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let top, left;
        
        // Calcular posición inicial basada en la preferencia
        switch (step.position) {
            case 'top':
                top = rect.top - tooltipHeight - 20;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'bottom':
                top = rect.bottom + 30;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
                left = rect.left - tooltipWidth - 20;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
                left = rect.right + 20;
                break;
            default:
                // Por defecto, mostrar debajo del elemento
                top = rect.bottom + 30;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        }
        
        // Ajustar posición para que esté dentro del viewport
        // Ajustar horizontalmente
        if (left < 20) {
            left = 20;
        } else if (left + tooltipWidth > viewportWidth - 20) {
            left = viewportWidth - tooltipWidth - 20;
        }
        
        // Ajustar verticalmente
        if (top < 20) {
            // Si no cabe arriba, intentar ponerlo abajo
            const bottomPosition = rect.bottom + 30;
            if (bottomPosition + tooltipHeight <= viewportHeight - 20) {
                top = bottomPosition;
            } else {
                // Si tampoco cabe abajo, centrarlo verticalmente
                top = Math.max(20, (viewportHeight - tooltipHeight) / 2);
            }
        } else if (top + tooltipHeight > viewportHeight - 20) {
            // Si no cabe abajo, intentar ponerlo arriba
            const topPosition = rect.top - tooltipHeight - 20;
            if (topPosition >= 20) {
                top = topPosition;
            } else {
                // Si tampoco cabe arriba, centrarlo verticalmente
                top = Math.max(20, (viewportHeight - tooltipHeight) / 2);
            }
        }
        
        // Hacer scroll automático para centrar el elemento en la pantalla
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.top + (elementRect.height / 2);
        const viewportCenter = viewportHeight / 2;
        
        // Si el elemento no está centrado, hacer scroll suave
        if (Math.abs(elementCenter - viewportCenter) > 100) {
            const scrollToPosition = window.pageYOffset + elementCenter - viewportCenter;
            window.scrollTo({
                top: Math.max(0, scrollToPosition),
                behavior: 'smooth'
            });
        }

        // Debug final para "Estatus de Taller"
        if (step.title === 'Estatus de Taller') {
            console.log(`🤖 Tutorial: Estatus de Taller - Posición final: top=${top}, left=${left}`);
        }

        tooltip.style.cssText = `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            width: 350px;
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid #e9ecef;
        `;

        // Agregar información adicional según el paso
        let additionalInfo = '';
        if (step.title === 'Estadísticas de Tickets por Módulo') {
            additionalInfo = '<div style="margin-top: 12px; padding: 10px; background-color: #f8f9fa; border-radius: 6px; font-size: 14px; color: #666;"><strong>💡 Tip:</strong> Esta tabla se actualiza en tiempo real y te ayuda a identificar qué módulos requieren más atención.</div>';
        } else if (step.title === 'Estatus de Taller') {
            additionalInfo = '<div style="margin-top: 12px; padding: 10px; background-color: #e3f2fd; border-radius: 6px; font-size: 14px; color: #1976d2;"><strong>🔧 Información:</strong> Cada elemento muestra el estado actual de los equipos POS en el taller, desde reparación hasta entrega al cliente.</div>';
        } else if (step.title === 'Gráfica de Tickets Mensuales') {
            additionalInfo = '<div style="margin-top: 12px; padding: 10px; background-color: #fff3cd; border-radius: 6px; font-size: 14px; color: #856404;"><strong>📈 Análisis:</strong> Observa los picos y valles para planificar recursos y identificar patrones estacionales en la demanda.</div>';
        } else if (step.title === 'Gráfica de Tickets por Región') {
            additionalInfo = '<div style="margin-top: 12px; padding: 10px; background-color: #d1ecf1; border-radius: 6px; font-size: 14px; color: #0c5460;"><strong>🗺️ Distribución:</strong> Identifica qué regiones tienen mayor carga de trabajo para optimizar la distribución de técnicos.</div>';
        } else if (step.title.includes('Tickets')) {
            additionalInfo = '<div style="margin-top: 12px; padding: 10px; background-color: #f3e5f5; border-radius: 6px; font-size: 14px; color: #7b1fa2;"><strong>📊 Métricas:</strong> Los números y porcentajes te ayudan a evaluar el rendimiento y la carga de trabajo del equipo.</div>';
        }

        tooltip.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 12px 0; color: #333; font-size: 20px; font-weight: bold;">${step.title}</h4>
                <p style="margin: 0; color: #555; font-size: 16px; line-height: 1.5; font-weight: 500;">${step.description}</p>
                ${additionalInfo}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e9ecef; padding-top: 12px;">
                <div style="font-size: 13px; color: #666; font-weight: 500;">
                    Paso ${this.currentStep + 1} de ${this.tutorialSteps.length}
                </div>
                <div>
                    <button id="tutorial-skip" style="
                        background: #6c757d; 
                        color: white; 
                        border: none; 
                        padding: 10px 18px; 
                        border-radius: 6px; 
                        margin-right: 10px; 
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.backgroundColor='#5a6268'" onmouseout="this.style.backgroundColor='#6c757d'">Saltar</button>
                    ${this.currentStep === this.tutorialSteps.length - 1 ? 
                        '<button id="tutorial-finish" style="background: #28a745; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease;" onmouseover="this.style.backgroundColor=\'#218838\'" onmouseout="this.style.backgroundColor=\'#28a745\'">Finalizar</button>' :
                        '<button id="tutorial-next" style="background: #007bff; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease;" onmouseover="this.style.backgroundColor=\'#0056b3\'" onmouseout="this.style.backgroundColor=\'#007bff\'">Siguiente</button>'
                    }
                </div>
            </div>
        `;

        document.body.appendChild(tooltip);
        
        // Sin ajustes adicionales para evitar problemas de posicionamiento
    }
    
    // Asegurar que el tooltip sea completamente visible
    ensureTooltipVisibility(tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Verificar si el tooltip está fuera del viewport verticalmente
        if (tooltipRect.top < 0 || tooltipRect.bottom > viewportHeight) {
            // Hacer scroll suave para centrar el tooltip
            const scrollTop = window.pageYOffset + tooltipRect.top - (viewportHeight / 2) + (tooltipRect.height / 2);
            window.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: 'smooth'
            });
        }
        
        // Verificar si el tooltip está fuera del viewport horizontalmente
        if (tooltipRect.left < 0 || tooltipRect.right > viewportWidth) {
            // Ajustar posición horizontal si es necesario
            const newLeft = Math.max(20, Math.min(tooltipRect.left, viewportWidth - tooltipRect.width - 20));
            tooltip.style.left = `${newLeft}px`;
        }
        
        // Verificar también el elemento resaltado
        if (this.highlightedElement) {
            const elementRect = this.highlightedElement.getBoundingClientRect();
            
            // Si el elemento está fuera del viewport, hacer scroll para centrarlo
            if (elementRect.top < 0 || elementRect.bottom > viewportHeight) {
                const elementScrollTop = window.pageYOffset + elementRect.top - (viewportHeight / 2) + (elementRect.height / 2);
                window.scrollTo({
                    top: Math.max(0, elementScrollTop),
                    behavior: 'smooth'
                });
            }
        }
    }

    // Agregar listeners para controles del tutorial
    addStepListeners() {
        const nextBtn = document.getElementById('tutorial-next');
        const finishBtn = document.getElementById('tutorial-finish');
        const skipBtn = document.getElementById('tutorial-skip');

        if (nextBtn) {
            nextBtn.onclick = () => this.nextStep();
        }

        if (finishBtn) {
            finishBtn.onclick = () => this.endTutorial();
        }

        if (skipBtn) {
            skipBtn.onclick = () => this.endTutorial();
        }

        // Permitir click en el elemento resaltado para avanzar
        if (this.highlightedElement) {
            this.highlightedElement.style.pointerEvents = 'auto';
            this.highlightedElement.style.cursor = 'pointer';
            this.highlightedElement.onclick = () => {
                if (this.currentStep === this.tutorialSteps.length - 1) {
                    this.endTutorial();
                } else {
                    this.nextStep();
                }
            };
        }
    }

    // Siguiente paso
    async nextStep() {
        this.currentStep++;
        this.removeHighlight();
        this.removeTooltip();
        await this.showStep(this.currentStep);
    }

    // Finalizar tutorial
    endTutorial() {
        this.isActive = false;
        this.removeHighlight();
        this.removeTooltip();
        this.removeOverlay();
        this.removeStyles();
        this.showChatbot();
    }
    
    // Ocultar el chatbot durante el tutorial
    hideChatbot() {
        const chatbotPanel = document.getElementById('assistantPanel');
        const chatbotAvatar = document.getElementById('assistantAvatar');
        
        if (chatbotPanel) {
            chatbotPanel.style.display = 'none';
        }
        if (chatbotAvatar) {
            chatbotAvatar.style.display = 'none';
        }
    }
    
    // Mostrar el chatbot después del tutorial
    showChatbot() {
        const chatbotPanel = document.getElementById('assistantPanel');
        const chatbotAvatar = document.getElementById('assistantAvatar');
        
        if (chatbotPanel) {
            chatbotPanel.style.display = '';
        }
        if (chatbotAvatar) {
            chatbotAvatar.style.display = '';
        }
    }

    // Limpiar elementos del tutorial
    removeHighlight() {
        const highlight = document.getElementById('tutorial-highlight');
        if (highlight) {
            highlight.remove();
        }
        if (this.highlightedElement) {
            this.highlightedElement.style.pointerEvents = '';
            this.highlightedElement.style.cursor = '';
            this.highlightedElement.onclick = null;
        }
    }

    removeTooltip() {
        const tooltip = document.getElementById('tutorial-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    removeStyles() {
        const styles = document.getElementById('tutorial-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// TUTORIAL DE CONSULTA POR RIF
class ConsultaRIFTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;
        this.tutorialSteps = [
            {
                selector: '#buscarPorRifBtn',
                title: 'Buscar por RIF',
                description: 'Haz clic aquí para buscar un cliente usando su RIF (ej: J-12345678-9).',
                position: 'bottom',
            },
            {
                selector: '#buscarPorSerialBtn',
                title: 'Buscar por Serial',
                description: 'Busca un equipo POS específico usando su número de serial (ej: 10000CT27000041).',
                position: 'bottom'
            },
            {
                selector: '#buscarPorNombreBtn',
                title: 'Buscar por Razón Social',
                description: 'Encuentra clientes por el nombre de su empresa (ej: "Mi Empresa, C.A.").',
                position: 'bottom'
            },
            // PASO: Resaltar el BOTÓN "BUSCAR" PRIMERO
            {
                selector: '#buscarRazon',
                title: 'Botón Buscar',
                description: 'Este botón inicia la búsqueda con el texto que ingreses en el campo. Te mostraré el campo a continuación.',
                position: 'right',

                waitFor: () => {
                    const btn = document.getElementById('buscarRazon');
                    return btn && btn.offsetParent !== null;
                }
            },
{
    selector: '#RazonInput',
                title: 'Campo de Búsqueda por Razón Social',
                description: 'Aquí ingresas el nombre o parte del nombre de la empresa. Cuando hagas click en "Siguiente", el tutorial escribirá "INV" automáticamente y hará la búsqueda.', 
    position: 'bottom',

    waitFor: () => {
        const input = document.getElementById('RazonInput');
        if (!input) return false;

        const style = window.getComputedStyle(input);
        return input.offsetParent !== null &&
               style.display !== 'none' &&
               style.visibility !== 'hidden';
                }
},
            {
                selector: '#rifCountTable',
                title: 'Resultados de Búsqueda',
                description: 'Aquí aparecen todos los POS asociados al cliente con "INV". El tutorial hará click automáticamente en un <strong>Serial POS</strong> para mostrar los detalles.',
                position: 'top',
                waitFor: () => document.querySelector('#rifCountTable tbody tr td')?.textContent !== 'No hay datos'
            },
            {
                selector: '.serial-pos-column',
                title: 'Serial del POS',
                description: 'El tutorial hará click automáticamente en este serial para mostrar los detalles del equipo y las opciones para crear tickets.',
                position: 'bottom'
            },
            {
                selector: '#ModalSerial',
                title: 'Detalles del POS',
                description: 'Aquí ves toda la información del equipo: modelo, banco, dirección, etc.',
                position: 'center',
                waitFor: () => document.getElementById('ModalSerial').style.display === 'block'
            },
            {
                selector: '#createTicketFalla1Btn',
                title: 'Crear Ticket Falla 1',
                description: 'Usa este botón para reportar una falla crítica (ej: equipo no enciende).',
                position: 'top',
                waitFor: () => {
                    const btn = document.getElementById('createTicketFalla1Btn');
                    return btn && btn.offsetParent !== null;
                }
            },
            {
                selector: '#createTicketFalla2Btn',
                title: 'Crear Ticket Falla 2',
                description: 'Para fallas menores (ej: pantalla rota, botón dañado).',
                position: 'top'
            }
        ];
    }

    startTutorial() {
        if (this.isActive) return;
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.hideChatbot();
        this.showStep(0);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8); z-index: 9998;
        `;
        document.body.appendChild(this.overlay);
    }

    async showStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) {
            this.endTutorial();
            return;
        }

        const step = this.tutorialSteps[stepIndex];

        // Esperar a que el elemento exista o condición
        if (step.waitFor) {
            await this.waitForCondition(step.waitFor);
        }

        let element = document.querySelector(step.selector);
        if (!element) {
            console.warn(`Elemento no encontrado: ${step.selector}`);
            this.nextStep();
            return;
        }

        this.removeHighlight();
        this.removeTooltip();
        await this.prepareElementForHighlight(element);
        this.highlightElement(element);
        this.createTooltip(element, step);
        this.addStepListeners();
    }

    waitForCondition(condition) {
        return new Promise(resolve => {
            const check = () => {
                if (condition()) {
                    setTimeout(resolve, 300);
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    }

    prepareElementForHighlight(element) {
        return new Promise(resolve => {
            const modalContent = document.getElementById('ModalSerial-content');
            if (!modalContent || !element.closest('#ModalSerial-content')) {
                // Scroll de página si no está en el modal
        const rect = element.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        if (Math.abs(centerY - viewportCenter) > 100) {
            window.scrollTo({
                top: window.pageYOffset + centerY - viewportCenter,
                behavior: 'smooth'
            });
                    setTimeout(resolve, 800);
                } else {
                    resolve();
                }
                return;
            }

            // SCROLL DENTRO DEL MODAL (#ModalSerial-content)
            const contentRect = modalContent.getBoundingClientRect();
            const elRect = element.getBoundingClientRect();
            const elementTopInContent = elRect.top - contentRect.top + modalContent.scrollTop;
            const contentVisibleHeight = modalContent.clientHeight;

            if (elementTopInContent < modalContent.scrollTop || 
                elementTopInContent + elRect.height > modalContent.scrollTop + contentVisibleHeight) {

                const targetScroll = elementTopInContent - (contentVisibleHeight / 2) + (elRect.height / 2);

                modalContent.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });

                setTimeout(resolve, 800);
            } else {
                resolve();
            }
        });
    }

    highlightElement(element) {
        this.highlightedElement = element;
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.id = 'tutorial-highlight';
        highlight.style.cssText = `
            position: fixed; top: ${rect.top - 5}px; left: ${rect.left - 5}px;
            width: ${rect.width + 10}px; height: ${rect.height + 10}px;
            border: 3px solid #007bff; border-radius: 8px;
            background: rgba(0, 123, 255, 0.1); z-index: 9999;
            pointer-events: none; animation: tutorial-pulse 2s infinite;
        `;
        if (!document.getElementById('tutorial-styles')) {
            const style = document.createElement('style');
            style.id = 'tutorial-styles';
            style.textContent = `@keyframes tutorial-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(0,123,255,0.7); }
                70% { box-shadow: 0 0 0 10px rgba(0,123,255,0); }
            }`;
            document.head.appendChild(style);
        }
        document.body.appendChild(highlight);
    }

    createTooltip(element, step) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tutorial-tooltip';
        const rect = element.getBoundingClientRect();
        const width = 380, height = 160;
        let top, left;

        switch (step.position) {
            case 'top': top = rect.top - height - 20; left = rect.left + rect.width/2 - width/2; break;
            case 'bottom': top = rect.bottom + 20; left = rect.left + rect.width/2 - width/2; break;
            case 'left': top = rect.top + rect.height/2 - height/2; left = rect.left - width - 20; break;
            case 'right': top = rect.top + rect.height/2 - height/2; left = rect.right + 20; break;
            case 'center': top = window.innerHeight/2 - height/2; left = window.innerWidth/2 - width/2; break;
            default: top = rect.bottom + 20; left = rect.left + rect.width/2 - width/2;
        }

        // Ajustar límites
        left = Math.max(20, Math.min(left, window.innerWidth - width - 20));
        top = Math.max(20, Math.min(top, window.innerHeight - height - 20));

        tooltip.style.cssText = `
            position: fixed; top: ${top}px; left: ${left}px; width: ${width}px;
            background: white; border-radius: 12px; padding: 25px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 10000; font-family: -apple-system, sans-serif; border: 1px solid #e9ecef;
        `;

        tooltip.innerHTML = `
            <h4 style="margin:0 0 12px; color:#333; font-size:20px; font-weight:bold;">${step.title}</h4>
            <p style="margin:0; color:#555; font-size:16pxpx; line-height:1.5;">${step.description}</p>
            <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e9ecef; padding-top:12px;">
                <div style="font-size:13px; color:#666;">Paso ${this.currentStep + 1} de ${this.tutorialSteps.length}</div>
                <div>
                    <button id="tutorial-skip" style="background:#6c757d; color:white; border:none; padding:8px 16px; border-radius:6px; margin-right:8px; cursor:pointer;">Saltar</button>
                    ${this.currentStep === this.tutorialSteps.length - 1
                        ? '<button id="tutorial-finish" style="background:#28a745; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Finalizar</button>'
                        : '<button id="tutorial-next" style="background:#007bff; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Siguiente</button>'
                    }
                </div>
            </div>
        `;
        document.body.appendChild(tooltip);

        // Click en elemento avanza
        element.style.cursor = 'pointer';
        element.onclick = () => this.nextStep();
    }

    addStepListeners() {
        const next = document.getElementById('tutorial-next');
        const finish = document.getElementById('tutorial-finish');
        const skip = document.getElementById('tutorial-skip');
        if (next) next.onclick = () => this.nextStep();
        if (finish) finish.onclick = () => this.endTutorial();
        if (skip) skip.onclick = () => this.endTutorial();
    }

    async nextStep() {
        // Si estamos avanzando DESDE el paso 2 (Buscar por Razón Social), hacer click automático en el botón
        if (this.currentStep === 2) {
            const buscarPorNombreBtn = document.getElementById('buscarPorNombreBtn');
            if (buscarPorNombreBtn) {
                console.log("🤖 Tutorial: Haciendo click automático en 'Buscar por Razón Social'");
                buscarPorNombreBtn.click();
                // Esperar un momento para que se muestren los elementos
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            // Continuar con el flujo normal
            this.currentStep++;
            this.removeHighlight();
            this.removeTooltip();
            await this.showStep(this.currentStep);
            return;
        }
        
        // Si estamos avanzando DESDE el paso 4 (Campo RazonInput), colocar texto y hacer búsqueda automática
        if (this.currentStep === 4) {
            const buscarRazonBtn = document.getElementById('buscarRazon');
            const razonInput = document.getElementById('RazonInput');
            
            if (buscarRazonBtn && razonInput) {
                console.log("🤖 Tutorial: Escribiendo 'INV' en el campo y haciendo búsqueda automática");
                
                // Limpiar tooltip actual
                this.removeHighlight();
                this.removeTooltip();
                
                // Escribir "INV" en el campo con efectos visuales
                razonInput.focus();
                razonInput.value = 'INV';
                razonInput.dispatchEvent(new Event('input', { bubbles: true }));
                razonInput.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Pequeña pausa para que el usuario vea el texto escribiéndose
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Ejecutar la función de búsqueda directamente
                if (typeof SendRazon === 'function') {
                    SendRazon();
                } else {
                    // Fallback: hacer click en el botón
                    buscarRazonBtn.click();
                }
                
                // Esperar a que se carguen los resultados
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Avanzar al siguiente paso (tabla de resultados)
                this.currentStep++;
                await this.showStep(this.currentStep);
                return;
            }
        }
        
       // Si estamos avanzando DESDE el paso 6 (Serial del POS), hacer click automático
       if (this.currentStep === 6) {
            console.log("Tutorial: Haciendo click automático en el serial POS");

            this.removeHighlight();
            this.removeTooltip();

            // BUSCAR EL <a> DENTRO DE LA CELDA CON CLASE serial-pos-column
            const serialLink = document.querySelector('#rifCountTable tbody tr td.serial-pos-column a');

            if (serialLink) {
                console.log("Encontrado enlace serial:", serialLink.textContent.trim());

                // Scroll a la tabla
                const table = document.getElementById('rifCountTable');
                if (table) {
                    table.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                setTimeout(() => {
                    // HACER CLIC DIRECTO EN EL <a>
                    serialLink.click();

                    // Forzar evento por si acaso
                    const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    serialLink.dispatchEvent(clickEvent);

                    // Esperar a que se abra el modal
                    setTimeout(() => {
                        this.currentStep++;
                        this.showStep(this.currentStep);
                    }, 1200);
                }, 600);

                return;
            } else {
                console.warn("Tutorial: No se encontró el <a> del serial. ¿Falta clase 'serial-pos-column'?");
                this.currentStep++;
                this.showStep(this.currentStep);
                return;
            }
        }
                
        // Flujo normal para todos los otros pasos
        this.currentStep++;
        this.removeHighlight();
        this.removeTooltip();
        await this.showStep(this.currentStep);
    }

    endTutorial() {
        this.isActive = false;
        this.removeHighlight();
        this.removeTooltip();
        this.removeOverlay();
        this.removeStyles();
        this.showChatbot();
    }

    removeHighlight() {
        const h = document.getElementById('tutorial-highlight');
        if (h) h.remove();
        if (this.highlightedElement) {
            this.highlightedElement.style.cursor = '';
            this.highlightedElement.onclick = null;
        }
    }

    removeTooltip() { const t = document.getElementById('tutorial-tooltip'); if (t) t.remove(); }
    removeOverlay() { if (this.overlay) this.overlay.remove(); }
    removeStyles() { const s = document.getElementById('tutorial-styles'); if (s) s.remove(); }

    hideChatbot() {
        const panel = document.getElementById('assistantPanel');
        const avatar = document.getElementById('assistantAvatar');
        if (panel) panel.style.display = 'none';
        if (avatar) avatar.style.display = 'none';
    }

    showChatbot() {
        const panel = document.getElementById('assistantPanel');
        const avatar = document.getElementById('assistantAvatar');
        if (panel) panel.style.display = '';
        if (avatar) avatar.style.display = '';
    }
}

// TUTORIAL DE GESTIÓN COORDINACIÓN
class GestionCoordinadorTutorial {
    constructor() {
        this.restoreActionButtonsStyle = () => {
            [
                '.btn-received-coord',
                '.btn-assign-tech',
                '.btn-reassign-tech',
                '.btn-view-image',
                '#botonMostarNoImage',
                '#hiperbinComponents',
                '.btn-secondary[onclick^="printHistory"]'
            ].forEach(selector => {
                document.querySelectorAll(selector).forEach(btn => {
                    btn.style.zIndex = '';
                    btn.style.position = '';
                });
            });
        };

        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        // === PASOS DEL TUTORIAL ===
        this.tutorialSteps = [
            { selector: '#tabla-ticket', title: 'Tabla de Tickets', description: 'Aquí se listan todos los tickets disponibles.', position: 'top' },
            { selector: '.dt-buttons-container', title: 'Filtros Rápidos', description: 'Usa estos 4 botones para filtrar rápidamente.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null },

            // FILTRO: POR ASIGNAR
            { selector: '#btn-por-asignar', title: 'Filtro 1: Por Asignar', description: 'Muestra tickets que aún <strong>NO tienen técnico asignado</strong>.', position: 'bottom', waitFor: () => document.getElementById('btn-por-asignar') !== null, onNext: () => this.clickFilterInstant('#btn-por-asignar') },
            { selector: '#tabla-ticket tbody tr td:last-child, #btn-por-asignar', title: 'Columna de Acciones', description: 'Desplazando la tabla para ver los botones disponibles...', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.scrollToActionsColumn() },

            // BOTONES EN "POR ASIGNAR" - VISIBLES Y CENTRADOS
            { 
                selector: '#tabla-ticket tbody tr td .btn-received-coord', 
                title: 'Botón: Marcar Recibido', 
                description: 'Marca el ticket como <strong>Recibido por Coordinación</strong>.', 
                position: 'left',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-received-coord') !== null,
                onShow: () => this.ensureButtonVisible('.btn-received-coord')
            },
            { 
                selector: '#tabla-ticket tbody tr td .btn-assign-tech', 
                title: 'Botón: Asignar Técnico', 
                description: 'Abre el flujo para <strong>asignar un técnico</strong>.', 
                position: 'left',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-assign-tech') !== null,
                onShow: () => this.ensureButtonVisible('.btn-assign-tech')
            },
            { 
                selector: '#tabla-ticket tbody tr td .btn-view-image, #tabla-ticket tbody tr td #botonMostarNoImage', 
                title: 'Botón: Ver Documentos', 
                description: 'Revisa documentos cargados (Envío, Anticipo, Exoneración).', 
                position: 'left',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-view-image, #tabla-ticket tbody tr td #botonMostarNoImage') !== null,
                onShow: () => this.ensureButtonVisible('.btn-view-image, #botonMostarNoImage')
            },

            { selector: '#tabla-ticket tbody tr', title: 'Seleccionando Ticket', description: 'Haciendo clic en el primer ticket para ver detalles...', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstTicketAutomatically() },
            { selector: '#ticket-details-panel', title: 'Detalles del Ticket', description: 'Aquí aparece toda la información del ticket seleccionado.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 },
            {
                selector: '#hiperbinComponents',
                title: 'Cargar Periféricos del POS',
                description: 'Este botón te permite <strong>cargar y asociar periféricos/componentes</strong> al equipo POS seleccionado. Haz clic aquí cuando necesites registrar impresoras, lectores, etc. asociados a este POS.',
                position: 'left',
                waitFor: () => document.getElementById('hiperbinComponents') !== null,
                onShow: () => {
                    // Enfasis visual igual a los action-buttons
                    const btn = document.getElementById('hiperbinComponents');
                    if (btn) {
                        btn.style.position = 'relative';
                        btn.style.zIndex = '10001';
                    }
                }
            },
            {
                selector: '.btn-secondary[onclick^="printHistory"]',
                title: 'Imprimir Historial del Ticket',
                description: 'Con este botón puedes <strong>imprimir o descargar en PDF</strong> el historial completo de acciones del ticket.',
                position: 'left',
                waitFor: () => document.querySelector('.btn-secondary[onclick^="printHistory"]') !== null,
                onShow: () => {
                    // Mismo énfasis visual
                    const btn = document.querySelector('.btn-secondary[onclick^="printHistory"]');
                    if (btn) {
                        btn.style.position = 'relative';
                        btn.style.zIndex = '10001';
                    }
                }
            },
            { selector: '#ticket-history-content', title: 'Historial del Ticket', description: 'Aquí se carga el historial completo de acciones, donde se pueden ver el flujo de los tickets a detalle.', position: 'left', waitFor: () => { const c = document.getElementById('ticket-history-content'); return c && c.innerHTML && !c.innerHTML.includes('Selecciona un ticket'); } },

            // FILTRO: RECIBIDOS
            { selector: '#btn-recibidos', title: 'Filtro 2: Recibidos', description: 'Tickets que el técnico ya marcó como <strong>"Recibido"</strong>.', position: 'bottom', waitFor: () => document.getElementById('btn-recibidos') !== null, onNext: () => this.clickFilterInstant('#btn-recibidos') },

            // FILTRO: ASIGNADOS
            { selector: '#btn-asignados', title: 'Filtro 3: Asignados', description: 'Tickets con <strong>técnico asignado</strong>, pero aún no recibidos.', position: 'bottom', waitFor: () => document.getElementById('btn-asignados') !== null, onNext: () => this.clickFilterInstant('#btn-asignados') },
            { selector: '#tabla-ticket tbody tr td:last-child, #btn-asignados', title: 'Columna de Acciones', description: 'Desplazando para ver botones en "Asignados"...', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.scrollToActionsColumn() },

            // BOTONES EN "ASIGNADOS"
            { 
                selector: '#tabla-ticket tbody tr td .btn-reassign-tech', 
                title: 'Botón: Reasignar Técnico', 
                description: 'Permite <strong>reasignar</strong> a otro técnico si no ha enviado al taller.', 
                position: 'left',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-reassign-tech') !== null,
                onShow: () => this.ensureButtonVisible('.btn-reassign-tech')
            },
            { 
                selector: '#tabla-ticket tbody tr td .btn-view-image, #tabla-ticket tbody tr td #botonMostarNoImage', 
                title: 'Botón: Ver Documentos', 
                description: 'También puedes ver documentos desde "Asignados".', 
                position: 'left',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-view-image, #tabla-ticket tbody tr td #botonMostarNoImage') !== null,
                onShow: () => this.ensureButtonVisible('.btn-view-image, #botonMostarNoImage')
            },

            // ÚLTIMO PASO: REASIGNADOS → BOTÓN "FINALIZAR"
            {
                selector: '#btn-reasignado',
                title: 'Filtro 4: Reasignados',
                description: `
                    Muestra tickets <strong>reasignados a otro técnico</strong>.<br><br>
                    <div style="background:#e3f2fd;padding:10px;border-radius:8px;font-size:14px;">
                    <strong>TIP:</strong> Solo se puede reasignar si el técnico actual <strong>no ha enviado el ticket al taller</strong>.
                    </div>
                `,
                position: 'bottom',
                waitFor: () => document.getElementById('btn-reasignado') !== null,
                onNext: () => this.clickFilterInstant('#btn-reasignado'),
                isLastStep: true
            }
        ];

        // === MÉTODOS AUXILIARES ===
        this.clickFilterInstant = (selector) => {
            const btn = document.querySelector(selector);
            if (btn) btn.click();
            return Promise.resolve();
        };

        this.scrollToActionsColumn = () => {
            return new Promise(resolve => {
                const table = document.getElementById('tabla-ticket');
                const firstRow = document.querySelector('#tabla-ticket tbody tr');
                if (!table || !firstRow) return setTimeout(resolve, 300);

                const lastCell = firstRow.querySelector('td:last-child');
                if (!lastCell) return setTimeout(resolve, 300);

                const wrapper = table.closest('.dataTables_wrapper');
                let scrollContainer = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;

                if (scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                    const target = lastCell.offsetLeft + lastCell.offsetWidth - scrollContainer.clientWidth + 40;
                    scrollContainer.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
                    setTimeout(resolve, 900);
                } else {
                    setTimeout(resolve, 300);
                }
            });
        };

        this.selectFirstTicketAutomatically = () => {
            return new Promise(resolve => {
                let row = document.querySelector('#tabla-ticket tbody tr');
                if (!row) {
                    const fallback = document.getElementById('btn-por-asignar') || document.getElementById('btn-recibidos') || document.getElementById('btn-asignados');
                    if (fallback) fallback.click();
                    setTimeout(() => {
                        row = document.querySelector('#tabla-ticket tbody tr');
                        if (!row) {
                            this.showTemporaryMessage('No hay tickets. Continuando...', 2000);
                            setTimeout(() => this.nextStep(), 2000);
                            return;
                        }
                        row.click();
                        this.showTemporaryMessage('Ticket seleccionado.', 1500);
                        setTimeout(resolve, 800);
                    }, 700);
                    return;
                }
                row.click();
                this.showTemporaryMessage('Ticket seleccionado.', 1500);
                setTimeout(resolve, 800);
            });
        };

        this.showTemporaryMessage = (text, duration = 1500) => {
            const msg = document.createElement('div');
            msg.textContent = text;
            msg.style.cssText = `
                position:fixed; top:20px; left:50%; transform:translateX(-50%);
                background:#28a745; color:white; padding:12px 24px; border-radius:10px;
                font-weight:bold; z-index:10001; font-size:15px; box-shadow:0 6px 16px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), duration);
        };

        // === ASEGURA QUE EL BOTÓN ESTÉ VISIBLE Y CENTRADO ===
        this.ensureButtonVisible = (selector) => {
            return new Promise(resolve => {
                const btn = document.querySelector(selector);
                if (!btn) return setTimeout(resolve, 300);

                const rect = btn.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = centerY - viewportCenter;

                if (Math.abs(offset) > 50) {
                    window.scrollTo({
                        top: window.pageYOffset + offset,
                        behavior: 'smooth'
                    });
                    setTimeout(resolve, 600);
                } else {
                    setTimeout(resolve, 300);
                }

                setTimeout(() => {
                    btn.style.position = 'relative';
                    btn.style.zIndex = '10001';
                }, 100);
            });
        };

        // === MÉTODOS PRINCIPALES ===
        this.startTutorial = () => {
            if (this.isActive) return;
            this.isActive = true;
            this.currentStep = 0;
            this.createOverlay();
            this.showStep(0);
        };

        this.createOverlay = () => {
            this.overlay = document.createElement('div');
            this.overlay.id = 'tutorial-overlay';
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;';
            document.body.appendChild(this.overlay);
        };

        this.showStep = async (stepIndex) => {
            if (stepIndex >= this.tutorialSteps.length) { this.endTutorial(); return; }
            const step = this.tutorialSteps[stepIndex];

            if (step.waitFor) {
                try {
                    await this.waitForCondition(step.waitFor);
                } catch (e) {
                    console.warn(`Esperando: ${step.selector} → saltando.`);
                    this.nextStep();
                    return;
                }
            }

            const element = document.querySelector(step.selector);
            if (!element) {
                console.warn(`Elemento no encontrado: ${step.selector}`);
                this.nextStep();
                return;
            }

            if (step.onShow) {
                try {
                    await step.onShow();
                } catch (e) {
                    console.warn('Error en onShow:', e);
                }
            }

            // Detectar si el paso actual es de botón de acción (usa tu propia lista aquí)
            const isActionButtonStep =
                step.title === 'Botón: Marcar Recibido' ||
                step.title === 'Botón: Asignar Técnico' ||
                step.title === 'Botón: Reasignar Técnico' ||
                step.title === 'Botón: Ver Documentos' ||
                element.classList.contains('btn-received-coord') ||
                element.classList.contains('btn-assign-tech') ||
                element.classList.contains('btn-reassign-tech') ||
                element.classList.contains('btn-view-image') ||
                element.id === 'botonMostarNoImage';
                
            if (!isActionButtonStep && typeof this.restoreActionButtonsStyle === 'function') {
                this.restoreActionButtonsStyle();
            }

            this.removeHighlight();
            await this.prepareElementForHighlight(element);
            this.highlightElement(element);
            this.createTooltip(element, step);
            this.addStepListeners();
        };

        this.waitForCondition = (condition) => {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const check = () => {
                    if (condition()) resolve();
                    else if (attempts++ > 60) reject();
                    else setTimeout(check, 100);
                };
                check();
            });
        };

        this.prepareElementForHighlight = (el) => {
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            if (Math.abs(centerY - viewportCenter) > 100) {
                window.scrollTo({ top: window.pageYOffset + centerY - viewportCenter, behavior: 'smooth' });
                return new Promise(r => setTimeout(r, 600));
            }
            return Promise.resolve();
        };

        this.highlightElement = (el) => {
            this.highlightedElement = el;
            const rect = el.getBoundingClientRect();
            const h = document.createElement('div');
            h.id = 'tutorial-highlight';
            h.style.cssText = `
                position:fixed; top:${rect.top-6}px; left:${rect.left-6}px;
                width:${rect.width+12}px; height:${rect.height+12}px;
                border:4px solid #007bff; border-radius:12px;
                background:rgba(0,123,255,0.15); z-index:9999; pointer-events:none;
                animation: pulse 1.5s infinite;
            `;
            document.body.appendChild(h);
        };

       this.createTooltip = (el, step) => {
    if (!el) return;
    const tooltip = document.createElement('div');
    tooltip.id = 'tutorial-tooltip';
    const rect = el.getBoundingClientRect();
    const width = 380;

    // Detecta si es un botón de acción (clase o título)
    const isActionButton =
        step.title === 'Botón: Marcar Recibido' ||
        step.title === 'Botón: Asignar Técnico' ||
        step.title === 'Botón: Reasignar Técnico' ||
        step.title === 'Botón: Ver Documentos' ||
        el.classList.contains('btn-received-coord') ||
        el.classList.contains('btn-assign-tech') ||
        el.classList.contains('btn-reassign-tech') ||
        el.classList.contains('btn-view-image') ||
        el.id === 'botonMostarNoImage';

    // POSICIÓN calculada
    let top, left;
    if (isActionButton) {
        // SIEMPRE debajo del botón, con separación extra
        top = rect.bottom + 40;
        left = rect.left + rect.width / 2 - width / 2;
    } else if (step.position === 'bottom') {
        top = rect.bottom + 30;
        left = rect.left + rect.width / 2 - width / 2;
    } else if (step.position === 'top') {
        top = rect.top - 220;
        left = rect.left + rect.width / 2 - width / 2;
    } else if (step.position === 'left') {
        top = rect.top + rect.height / 2 - 100;
        left = rect.left - width - 24;
    } else if (step.position === 'right') {
        top = rect.top + rect.height / 2 - 100;
        left = rect.right + 24;
    } else {
        top = rect.top + rect.height / 2 - 100;
        left = rect.left + rect.width / 2 - width / 2;
    }

    // Límites de pantalla
    left = Math.max(15, Math.min(left, window.innerWidth - width - 15));
    top = Math.max(15, Math.min(top, window.innerHeight - 220));

    // Botón finaliza
    const isLast = step.isLastStep;
    const nextText = isLast ? 'Finalizar' : 'Siguiente';
    const nextBg = isLast ? '#28a745' : '#007bff';

    // ESTILO DEL TOOLTIP
    tooltip.style.cssText = `
        position:fixed; top:${top}px; left:${left}px; width:${width}px;
        background:white; border:3px solid #007bff; border-radius:18px;
        padding:24px; box-shadow:0 16px 40px rgba(0,0,0,0.28);
        z-index:10000; font-family:'Segoe UI',sans-serif;
        animation:popIn 0.3s ease;
    `;

    tooltip.innerHTML = `
        <style>
            @keyframes popIn { from {opacity:0;transform:scale(0.9) translateY(-10px);} to {opacity:1;transform:scale(1);} }
        </style>
        <h4 style="margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;">${step.title}</h4>
        <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${step.description}</p>
        <div style="display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
            <button id="tutorial-skip" class="tutorial-btn tutorial-btn-skip" style="background:#6c757d; color:white; border:none; padding:11px 20px; border-radius:12px; font-size:14px; cursor:pointer; font-weight:600; margin-right:8px;">Saltar</button>
            <button id="tutorial-next" class="tutorial-btn tutorial-btn-next" style="background:${nextBg}; color:white; border:none; padding:11px 20px; border-radius:12px; font-size:14px; cursor:pointer; font-weight:600;">${nextText}</button>
        </div>
    `;

    document.body.appendChild(tooltip);
        };

        this.addStepListeners = () => {
            const next = document.getElementById('tutorial-next');
            const skip = document.getElementById('tutorial-skip');
            if (next) next.onclick = () => this.nextStep();
            if (skip) skip.onclick = () => this.endTutorial();
        };

        this.nextStep = async () => {
            const prev = this.tutorialSteps[this.currentStep];
            if (prev?.onNext) {
                try { await prev.onNext(); } catch (e) { console.warn('Error en onNext:', e); }
            }

            this.currentStep++;

            if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) {
                this.endTutorial();
                return;
            }

            this.removeHighlight();
            this.removeTooltip();
            this.showStep(this.currentStep);
        };

        this.endTutorial = () => {
            this.isActive = false;
            this.removeHighlight();
            this.removeTooltip();
            if (this.overlay) this.overlay.remove();
        };

        this.removeHighlight = () => { const h = document.getElementById('tutorial-highlight'); if (h) h.remove(); };
        this.removeTooltip = () => { const t = document.getElementById('tutorial-tooltip'); if (t) t.remove(); };
    }
}

//TUTORIAL GESTION TECNICO
class GestionTecnicoTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        // PASOS
        this.tutorialSteps = [
            // 1) Tabla
            { selector: '#tabla-ticket', title: 'Tabla de Tickets', description: 'En este módulo cada técnico verá únicamente los tickets que le fueron asignados para su gestión.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },

            // 2) Filtros
            { selector: '.dt-buttons-container', title: 'Filtros de la Tabla', description: 'Filtra por estado: Asignados, Recibidos, Enviados a Taller y Entregados al Cliente.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null },

            // 2.1) Asignados
            { selector: '#btn-asignados', title: 'Filtro: Asignados', description: 'Tickets que el coordinador ya te asignó. Aquí comienza tu trabajo.', position: 'bottom', waitFor: () => document.getElementById('btn-asignados') !== null, onNext: () => this.click('#btn-asignados') },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Cuando exista, aquí verás acciones del ticket. Primero te explico cómo confirmar recibido.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: () => this.scrollToActions() },

            // Confirmar Recibido (en Asignados)
            {
                selector: '#tabla-ticket tbody tr td .btn-received-ticket',
                title: 'Acción: Confirmar Recibido',
                description: 'Marca el ticket como <strong>Recibido por Técnico</strong>. <br><span style="color:#dc3545;font-weight:700">TIP:</span> Si Coordinación ya lo marcó como recibido, no necesitas hacerlo. Si <strong>no</strong>, <span style="color:#dc3545;font-weight:700">es obligatorio</span> confirmarlo para habilitar las demás acciones.',
                position: 'bottom',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-received-ticket, #tabla-ticket tbody tr td .btn-wrench-custom') !== null,
                onShow: async () => { await this.scrollToActions(); this.raise('.btn-received-ticket'); },
                onNext: () => { this.restoreButtons(); this.click('#btn-recibidos'); }
            },

            // 2.2) Recibidos
            { selector: '#btn-recibidos', title: 'Filtro: Recibidos', description: 'Tickets que ya están marcados como <strong>Recibidos</strong> por el técnico. Aquí verás las acciones habilitadas.', position: 'bottom', waitFor: () => document.getElementById('btn-recibidos') !== null },

            // Desplazar a acciones en Recibidos
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando para mostrar las acciones disponibles en este estado.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: () => this.scrollToActions() },

            // PRIMERO: Cargar documentos (Pago/Exoneración/Envío)
            {
                selector: '#tabla-ticket tbody tr td .btn-document-actions-modal',
                title: 'Acción: Cargar Documentos',
                description: 'Desde aquí puedes <strong>cargar y/o visualizar</strong> los documentos del ticket: <strong>Pago de Anticipo</strong>, <strong>Exoneración</strong> y <strong>Envío</strong> (Nota de Entrega).',
                position: 'bottom',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-document-actions-modal') !== null,
                onShow: async () => { await this.scrollToActions(); this.raise('.btn-document-actions-modal'); }
            },

            // LUEGO: Enviar a Taller (con validaciones + click automático)
            { 
                selector: '#tabla-ticket tbody tr td .btn-wrench-custom',
                title: 'Acción: Enviar a Taller',
                description: `
                    <div style="color:#dc3545;font-weight:700;margin-bottom:8px;">OJO: SÓLO PUEDES ENVIAR AL TALLER si ya te verificaron uno de los siguientes o estás solvente:</div>
                    <ul style="margin:0 0 10px 18px;color:#dc3545;font-weight:700;line-height:1.5;">
                        <li>Pago de Anticipo</li>
                        <li>Exoneración</li>
                        <li>Domiciliación — Solvente</li>
                    </ul>
                    Si falta cualquiera de estos, <strong style="color:#dc3545">NO podrás enviar al taller</strong>. Ahora haré clic automáticamente para mostrar las acciones.
                `,
                position: 'right',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-wrench-custom') !== null,
                onShow: async () => { await this.scrollToActions(); this.raise('.btn-wrench-custom'); },
                onNext: () => {
                    const btn = document.querySelector('#tabla-ticket tbody tr td .btn-wrench-custom');
                    if (btn) btn.click(); // abre el modal
                }
            },

            // Modal: Seleccionar Acción (explicación)
            { 
                selector: '#actionSelectionModal .action-buttons, #actionSelectionModal',
                title: 'Seleccionar Acción',
                description: `
                    Aquí decides qué hacer con el ticket:<br><br>
                    <span style="font-weight:700;">Enviar a Taller</span>: envía el equipo al taller para su revisión/servicio.<br>
                    <span style="font-weight:700;">Devolver al Cliente</span>: úsalo cuando el POS <strong>no presenta la falla reportada</strong> y está funcional; el ticket se visualizará en <strong>Gestión Rosal</strong> para la entrega.
                `,
                position: 'top',
                waitFor: () => document.getElementById('actionSelectionModal') !== null
            },
            { 
                selector: '#ButtonSendToTaller',
                title: 'Botón: Enviar a Taller',
                description: 'Confirma el envío del equipo al taller. El sistema validará los documentos requeridos antes de continuar.',
                position: 'bottom',
                waitFor: () => document.getElementById('ButtonSendToTaller') !== null,
                onShow: () => this.raise('#ButtonSendToTaller')
            },
            { 
                selector: '#devolver',
                title: 'Botón: Devolver al Cliente',
                description: 'Si el POS está operativo y la falla no se reproduce, usa esta opción. El ticket pasará a <strong>Gestión Rosal</strong> para la entrega.',
                position: 'bottom',
                waitFor: () => document.getElementById('devolver') !== null,
                onShow: () => this.raise('#devolver'),
                onNext: () => {
                    this.hideActionSelectionModal();
                    this.restoreButtons();
                    this.click('#btn-por-asignar'); // siguiente filtro
                }
            },

            // 2.3) Enviados a Taller
            { selector: '#btn-por-asignar', title: 'Filtro: Enviados a Taller', description: 'Lista los equipos ya enviados/“En Taller”. Útil para seguimiento del laboratorio.', position: 'bottom', waitFor: () => document.getElementById('btn-por-asignar') !== null },

            // 2.3.1) Ver documentos cuando el POS está en Taller (solo visualización)
            {
                selector: '#tabla-ticket tbody tr td .btn-document-actions-modal',
                title: 'Ver Documentos (En Taller)',
                description: 'Aquí puedes visualizar los documentos ya cargados (Envío, Exoneración, Pago) cuando el POS está en taller. Solo visualización.',
                position: 'bottom',
                waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-document-actions-modal') !== null,
                onShow: async () => {
                    await this.scrollToActions();
                    this.raise('.btn-document-actions-modal');
                }
            },

            // 2.4) Entregados (Cerrados)
            { selector: '#btn-devuelto', title: 'Filtro: Entregados al Cliente', description: 'Tickets cerrados. Referencia histórica y verificación final.', position: 'bottom', waitFor: () => document.getElementById('btn-devuelto') !== null, onNext: () => this.click('#btn-devuelto') },

            // 3) Selección de ticket y detalles
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Haremos clic en un ticket para ver sus detalles e historial.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstRow() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Aquí verás la información del ticket, serial, estatus y fechas claves.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 },

             // Periféricos del dispositivo (primero)
            {
                selector: '#hiperbinComponents',
                title: 'Cargar Periféricos del Dispositivo',
                description: 'Registra o actualiza los periféricos/componentes asociados al POS del ticket.',
                position: 'left',
                waitFor: () => document.getElementById('hiperbinComponents') !== null,
                onShow: () => this.raise('#hiperbinComponents'),
                onNext: () => {
                // Quitar estilos de énfasis y overlays al avanzar
                this.restoreButtons();                         // limpia z-index/position del botón
                this.removeHighlight();                        // quita el marco azul
                this.removeTooltip();                          // cierra el tooltip actual
                // Si quedó algún tooltip/backdrop de Bootstrap visible, elimínalo
                document.querySelectorAll('.tooltip.show,.modal-backdrop').forEach(n => n.remove());
            }
            },

            // Botón Imprimir Historial (segundo)
            {
                selector: '.btn-secondary[onclick^="printHistory"]',
                title: 'Imprimir Historial',
                description: 'Genera y descarga en PDF el historial completo de gestiones del ticket.',
                position: 'top',
                waitFor: () => document.querySelector('.btn-secondary[onclick^="printHistory"]') !== null,
                onShow: () => this.raise('.btn-secondary[onclick^="printHistory"]')
            },

            // Contenedor del historial (tercero)
            {
                selector: '#ticket-history-content',
                title: 'Historial del Ticket',
                description: 'Este contenedor mostrará el historial completo de gestiones del ticket.',
                position: 'left',
                waitFor: () => document.getElementById('ticket-history-content') !== null
            },

            // 7) Historial desplegable final
            { selector: '#ticketHistoryAccordion', title: 'Detalle del Historial', description: 'Aquí verás cada gestión con fechas, estados y cambios relevantes. ¡Listo!', position: 'left', waitFor: () => document.getElementById('ticketHistoryAccordion') !== null, isLastStep: true }
        ];

        // Helpers
        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.raise = (selector) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.position = 'relative';
                el.style.zIndex = '10001';
                el.style.boxShadow = '0 0 0 4px rgba(0,123,255,.45), 0 0 16px rgba(0,123,255,.8)';
                el.style.transform = 'scale(1.02)';
                el.style.transition = 'box-shadow .2s ease, transform .2s ease';
            }
        };
        this.restoreButtons = () => {
            ['.received-ticket-btn', '#marcarrecibido', '.deliver-ticket-btn', '.deliver-ticket-bt', '.upload-document-btn', '#openModalButton', '.send-to-region-btn', '.view-document-btn', '#viewimage', '.send-back-to-lab-btn'].forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.zIndex = '';
                    el.style.position = '';
                    el.style.boxShadow = '';
                    el.style.transform = '';
                    el.style.transition = '';
                    el.style.visibility = '';
                });
            });
        };
        this.forceResetRaisedButtons = () => {
            // Resetea cualquier botón que haya quedado con z-index elevado por pasos anteriores
            document.querySelectorAll('#tabla-ticket button[style*="z-index"], #tabla-ticket a[style*="z-index"]').forEach(el => {
                el.style.zIndex = '';
                el.style.position = '';
                el.style.boxShadow = '';
                el.style.transform = '';
                el.style.transition = '';
            });
        };
        this.hideButtons = (selectors) => {
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.visibility = 'hidden';
                    el.style.zIndex = '';
                    el.style.position = '';
                    el.style.boxShadow = '';
                    el.style.transform = '';
                });
            });
        };
        this.scrollToActions = () => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 300);
            const lastCell = row.querySelector('td:last-child');
            const wrapper = table.closest('.dataTables_wrapper');
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: lastCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 700);
            }
            setTimeout(resolve, 300);
        });
        this.selectFirstRow = () => new Promise(resolve => {
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (row) { row.click(); setTimeout(resolve, 700); } else setTimeout(resolve, 300);
        });

        // Ocultar modal genérico
        this.hideModal = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return;
            try {
                // jQuery fallback si existe
                if (typeof $ !== 'undefined' && typeof $(el).modal === 'function') {
                    try { $(el).modal('hide'); } catch (_) {}
                }
                const inst = bootstrap?.Modal?.getInstance ? bootstrap.Modal.getInstance(el) : null;
                if (inst) inst.hide();
                else if (bootstrap?.Modal) new bootstrap.Modal(el).hide();
            } catch (_) {}
            // Forzar cierre por si Bootstrap no está disponible o demora
            el.classList.remove('show');
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            // Quitar cualquier backdrop residual
            document.querySelectorAll('.modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show').forEach(b => b.remove());
            // Asegurar todos los modales queden cerrados
            document.querySelectorAll('.modal.show, .modal.fade.show').forEach(m => {
                m.classList.remove('show');
                m.setAttribute('aria-hidden', 'true');
                m.style.display = 'none';
                m.style.visibility = 'hidden';
                m.style.pointerEvents = 'none';
            });
            // Quitar clase/modal-open también del html por si algún tema la asigna
            document.documentElement.classList.remove('modal-open');
        };

        // Ocultar modal de acciones
        this.hideActionSelectionModal = () => {
            const el = document.getElementById('actionSelectionModal');
            if (!el) return;
            try {
                const inst = bootstrap?.Modal?.getInstance ? bootstrap.Modal.getInstance(el) : null;
                if (inst) inst.hide();
                else if (bootstrap?.Modal) new bootstrap.Modal(el).hide();
                else el.style.display = 'none';
            } catch (_) { el.style.display = 'none'; }
            el.classList.remove('show');
            el.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        };

        // Engine
        this.startTutorial = () => {
            if (this.isActive) return;
            this.isActive = true;
            this.currentStep = 0;
            this.createOverlay();
            this.showStep(0);
        };
        this.createOverlay = () => {
            this.overlay = document.createElement('div');
            this.overlay.id = 'tutorial-overlay';
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;';
            document.body.appendChild(this.overlay);
        };
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>80){rej();return;} setTimeout(tick,125);} ; tick(); });
        this.prepareElementForHighlight = async (el) => {
            const r = el.getBoundingClientRect(); const cy = r.top + r.height/2; const vc = window.innerHeight/2;
            if (Math.abs(cy - vc) > 120) { window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 600)); }
        };
        this.highlightElement = (el) => {
            this.highlightedElement = el;
            const r = el.getBoundingClientRect();
            const h = document.createElement('div');
            h.id = 'tutorial-highlight';
            h.style.cssText = `position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`;
            document.body.appendChild(h);
        };
        this.createTooltip = (el, step) => {
            const t = document.createElement('div'); t.id='tutorial-tooltip';
            const r = el.getBoundingClientRect(); const w = 380;
            let top, left;
            if (step.position === 'bottom') { top = r.bottom + 40; left = r.left + r.width/2 - w/2; }
            else if (step.position === 'top') { top = r.top - 220; left = r.left + r.width/2 - w/2; }
            else if (step.position === 'left') { top = r.top + r.height/2 - 100; left = r.left - w - 24; }
            else if (step.position === 'right') { top = r.top + r.height/2 - 100; left = r.right + 24; }
            else { top = r.top + r.height/2 - 100; left = r.left + r.width/2 - w/2; }
            left = Math.max(15, Math.min(left, window.innerWidth - w - 15));
            top = Math.max(15, Math.min(top, window.innerHeight - 220));
            const isLast = step.isLastStep;
            t.style.cssText = `position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`;
            t.innerHTML = `
                <style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style>
                <h4 style="margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;">${step.title}</h4>
                <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${step.description}</p>
                <div style="display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
                    <button id="tutorial-skip" style="background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">Saltar</button>
                    <button id="tutorial-next" style="background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">${isLast?'Finalizar':'Siguiente'}</button>
                </div>`;
            document.body.appendChild(t);
        };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.showStep = async (idx) => {
            if (idx >= this.tutorialSteps.length) return this.endTutorial();
            const step = this.tutorialSteps[idx];
            try { if (step.waitFor) await this.waitForCondition(step.waitFor); } catch { this.nextStep(); return; }
            const el = document.querySelector(step.selector); if (!el) { this.nextStep(); return; }
            if (!this.isButtonStep(step)) this.restoreButtons();
            if (step.onShow) { try { await step.onShow(); } catch {} }
            this.removeHighlight(); this.removeTooltip();
            await this.prepareElementForHighlight(el);
            this.highlightElement(el);
            this.createTooltip(el, step);
            this.addListeners();
        };
        this.isButtonStep = (step) => ['Acción: Confirmar Recibido','Acción: Cargar Documentos','Acción: Enviar a Taller','Botón: Enviar a Taller','Botón: Devolver al Cliente','Cargar Periféricos','Imprimir Historial'].includes(step.title);
        this.restoreButtons = () => {
            ['.btn-received-ticket', '.btn-document-actions-modal', '.btn-wrench-custom', '#ButtonSendToTaller', '#devolver', '#hiperbinComponents', '.btn-secondary[onclick^="printHistory"]'].forEach(s => {
                document.querySelectorAll(s).forEach(b => { b.style.zIndex=''; b.style.position=''; });
            });
        };
        this.addListeners = () => {
            const next = document.getElementById('tutorial-next');
            const skip = document.getElementById('tutorial-skip');
            if (next) next.onclick = () => this.nextStep();
            if (skip) skip.onclick = () => this.endTutorial();
        };
        this.nextStep = async () => {
            const prev = this.tutorialSteps[this.currentStep];
            if (prev?.onNext) { try { await prev.onNext(); } catch {} }
            // Asegurar cierre de modales antes de continuar
            try { await this.ensureModalClosed(); } catch {}
            this.currentStep++;
            if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { this.endTutorial(); return; }
            this.removeHighlight(); this.removeTooltip();
            this.showStep(this.currentStep);
        };
        this.endTutorial = () => { this.isActive=false; this.removeHighlight(); this.removeTooltip(); this.restoreButtons(); if (this.overlay) this.overlay.remove(); };
    }
}

// TUTORIAL MÓDULO EN TALLER (LABORATORIO)
class GestionTallerTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        // PASOS DEL TUTORIAL
        this.tutorialSteps = [
            // 1) Tabla base
            { selector: '#tabla-ticket_wrapper, #tabla-ticket', title: 'Tabla de Tickets (Taller)', description: 'Aquí verás los tickets gestionados por el laboratorio/taller.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },

            // 2) Contenedor de filtros
            { selector: '.dt-buttons-container', title: 'Filtros de Estado', description: 'Usa estos filtros para ver: Recibido en Taller, En Taller, Por confirmar llaves y Enviado al Rosal.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null },

            // 3) Recibido en Taller (btn-por-asignar)
            { selector: '#btn-por-asignar', title: 'Filtro: Recibido en Taller', description: 'Muestra equipos que llegaron al taller y están en espera de confirmar el recibido en taller.', position: 'bottom', waitFor: () => document.getElementById('btn-por-asignar') !== null, onNext: () => this.click('#btn-por-asignar') },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando la tabla para visualizar las acciones disponibles en este estado.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: () => this.scrollToActions() },
            { selector: '#tabla-ticket tbody tr td .confirm-waiting-btn', title: 'Acción: Confirmar Recibido en Taller', description: 'Confirma que el equipo fue recibido físicamente en el taller. Este botón está disponible en el primer filtro.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .confirm-waiting-btn') !== null, onShow: () => this.raise('.confirm-waiting-btn') },

            // 4) En Taller (btn-asignados)
            { selector: '#btn-asignados', title: 'Filtro: En Taller', description: 'Segundo filtro: equipos actualmente en proceso dentro del laboratorio.', position: 'bottom', waitFor: () => document.getElementById('btn-asignados') !== null, onNext: () => this.click('#btn-asignados') },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Te muestro los botones de trabajo del laboratorio.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: () => this.scrollToActions() },
            { selector: '#tabla-ticket tbody tr td #BtnChange', title: 'Acción: Cambiar Estatus', description: 'Abre el selector para cambiar el estatus del taller: En proceso de Reparación, Reparado, Pendiente por repuesto o Reingreso al Taller.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td #BtnChange') !== null, onShow: () => this.raise('#BtnChange'), onNext: () => { this.restoreButtons(); const b=document.querySelector('#tabla-ticket tbody tr td #BtnChange'); if(b) b.click(); } },
            { selector: '#changeStatusModal', title: 'Cambiar Estatus del Taller', description: '• Reparado: el equipo queda reparado y podrá enviarse al Rosal. Una vez reparado, ya no se debería cambiar el estatus desde taller. • Pendiente por Repuesto: se solicitará una fecha estimada de llegada; al vencer la fecha, se notificará y podrás actualizar a Irreparable desde Gestión Comercial si aplica. • Reingreso al Taller: úsalo si el dispositivo se dañó durante el envío y debe volver al laboratorio.', position: 'top', waitFor: () => { const m = document.getElementById('changeStatusModal'); if (!m) return false; const cs = window.getComputedStyle(m); return m.classList.contains('show') || cs.display === 'block' || cs.visibility === 'visible'; }, onNext: async () => { const closeBtn = document.getElementById('CerrarBoton'); if (closeBtn) { closeBtn.click(); } else { this.hideModal('#changeStatusModal'); } await new Promise(r=>setTimeout(r,300)); this.hideModal('#changeStatusModal'); await new Promise(r=>setTimeout(r,100)); } },

            // 5) Por confirmar carga de llaves (btn-recibidos)
            { selector: '#btn-recibidos', title: 'Filtro: Por confirmar llaves', description: 'Tercer filtro: tickets donde reposan los equipos reparados a la espera de confirmar la carga de llaves.', position: 'bottom', waitFor: () => document.getElementById('btn-recibidos') !== null, onShow: () => this.hideModal('#changeStatusModal'), onNext: async () => { this.click('#btn-recibidos'); await new Promise(r=>setTimeout(r,80)); await this.scrollToActions(); } },
            { selector: '#tabla-ticket tbody tr td .receive-key-checkbox', title: 'Acción: Confirmar Llave Recibida (opcional)', description: 'Casilla para indicar que el POS fue a carga de llaves. No es obligatorio marcarla; la confirmación final se realiza en Gestión Rosal.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .receive-key-checkbox') !== null, onShow: () => { this.raise('.receive-key-checkbox'); } },
            { selector: '#tabla-ticket tbody tr td .load-key-button', title: 'Acción: Enviar a Gestión Rosal', description: 'Botón que envía el equipo al módulo Gestión Rosal. Si no hay llave registrada, se solicitará confirmación antes de enviarlo. Una vez “Reparado” y enviado, no se debe cambiar estatus en taller.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .load-key-button') !== null, onShow: () => { this.raise('.load-key-button'); } },

            // 6) En Rosal (btn-devuelto)
            { selector: '#btn-devuelto', title: 'Filtro: En Gestión Rosal', description: 'Cuarto filtro: tickets ya enviados al módulo de Gestión Rosal para su entrega al cliente.', position: 'bottom', waitFor: () => document.getElementById('btn-devuelto') !== null, onNext: () => this.click('#btn-devuelto') },

            // 7) Selección, detalles e historial
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Haremos clic en un ticket para ver sus detalles e historial.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstRow() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Información del ticket, serial, estatus del taller y fechas clave.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 },
            { selector: '#ticket-history-content', title: 'Historial del Ticket', description: 'Registro de gestiones realizadas en el laboratorio para este ticket.', position: 'left', waitFor: () => document.getElementById('ticket-history-content') !== null },
            { selector: '.btn-secondary[onclick^="printHistory"]', title: 'Imprimir Historial', description: 'Genera un PDF con el historial completo del ticket.', position: 'top', waitFor: () => document.querySelector('.btn-secondary[onclick^="printHistory"]') !== null, onShow: () => this.raise('.btn-secondary[onclick^="printHistory"]') , isLastStep: true }
        ];

        // Helpers
        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.raise = (selector) => { const el = document.querySelector(selector); if (el) { el.style.position = 'relative'; el.style.zIndex = '10001'; el.style.boxShadow = '0 0 0 4px rgba(0,123,255,.45), 0 0 16px rgba(0,123,255,.8)'; } };
        this.restoreButtons = () => {
            ['.received-ticket-btn', '#marcarrecibido', '.deliver-ticket-btn', '.deliver-ticket-bt', '.upload-document-btn', '#openModalButton', '.send-to-region-btn', '.view-document-btn', '#viewimage', 'button.btn-secondary[title="No hay documento disponible"]', '.send-back-to-lab-btn']
            .forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.zIndex = '';
                    el.style.position = '';
                    el.style.boxShadow = '';
                    el.style.visibility = '';
                    el.style.pointerEvents = '';
                });
            });
        };
        this.hideButtons = (selectors) => {
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.visibility = 'hidden';
                    el.style.pointerEvents = 'none';
                    el.style.zIndex = '';
                    el.style.position = '';
                    el.style.boxShadow = '';
                });
            });
        };
        this.forceResetRaisedButtons = () => {
            document.querySelectorAll('#tabla-ticket button[style*="z-index"], #tabla-ticket a[style*="z-index"]').forEach(el => {
                el.style.zIndex = '';
                el.style.position = '';
                el.style.boxShadow = '';
            });
        };
        this.scrollToActions = () => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 300);
            const lastCell = row.querySelector('td:last-child');
            const wrapper = table.closest('.dataTables_wrapper');
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: lastCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 300);
        });
        this.selectFirstRow = () => new Promise(resolve => {
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (row) { row.click(); setTimeout(resolve, 500); } else setTimeout(resolve, 300);
        });

        // Restaurar estilos de énfasis de botones
        this.restoreButtons = () => {
            ['#BtnChange', '.confirm-waiting-btn', '.receive-key-checkbox', '.load-key-button', '.btn-secondary[onclick^="printHistory"]'].forEach(sel => {
                document.querySelectorAll(sel).forEach(el => { el.style.zIndex=''; el.style.position=''; });
            });
        };

        // Engine
        this.startTutorial = () => {
            if (this.isActive) return;
            this.isActive = true;
            this.currentStep = 0;
            this.createOverlay();
            this.showStep(0);
        };
        this.createOverlay = () => {
            this.overlay = document.createElement('div');
            this.overlay.id = 'tutorial-overlay';
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;';
            document.body.appendChild(this.overlay);
        };
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>100){rej();return;} setTimeout(tick,60);} ; tick(); });
        this.prepareElementForHighlight = async (el) => {
            const r = el.getBoundingClientRect(); const cy = r.top + r.height/2; const vc = window.innerHeight/2;
            if (Math.abs(cy - vc) > 120) { window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 600)); }
        };
        this.highlightElement = (el) => {
            this.highlightedElement = el;
            const r = el.getBoundingClientRect();
            const h = document.createElement('div');
            h.id = 'tutorial-highlight';
            h.style.cssText = `position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`;
            document.body.appendChild(h);
        };
        this.createTooltip = (el, step) => {
            const t = document.createElement('div'); t.id='tutorial-tooltip';
            const r = el.getBoundingClientRect(); const w = 380;
            let top, left;
            if (step.position === 'bottom') { top = r.bottom + 40; left = r.left + r.width/2 - w/2; }
            else if (step.position === 'top') { top = r.top - 220; left = r.left + r.width/2 - w/2; }
            else if (step.position === 'left') { top = r.top + r.height/2 - 100; left = r.left - w - 24; }
            else if (step.position === 'right') { top = r.top + r.height/2 - 100; left = r.right + 24; }
            else { top = r.top + r.height/2 - 100; left = r.left + r.width/2 - w/2; }
            left = Math.max(15, Math.min(left, window.innerWidth - w - 15));
            top = Math.max(15, Math.min(top, window.innerHeight - 220));
            const isLast = step.isLastStep;
            t.style.cssText = `position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`;
            t.innerHTML = `
                <style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style>
                <h4 style="margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;">${step.title}</h4>
                <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${step.description}</p>
                <div style="display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
                    <button id="tutorial-skip" style="background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">Saltar</button>
                    <button id="tutorial-next" style="background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">${isLast?'Finalizar':'Siguiente'}</button>
                </div>`;
            document.body.appendChild(t);
        };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.showStep = async (idx) => {
            if (idx >= this.tutorialSteps.length) return this.endTutorial();
            const step = this.tutorialSteps[idx];
            // Asegura que el modal de cambio de estatus no quede abierto entre pasos
            try { await this.ensureModalClosed(); } catch {}
            try { if (step.waitFor) await this.waitForCondition(step.waitFor); } catch { this.nextStep(); return; }
            const el = document.querySelector(step.selector); if (!el) { this.nextStep(); return; }
            if (step.onShow) { try { await step.onShow(); } catch {} }
            this.removeHighlight(); this.removeTooltip();
            await this.prepareElementForHighlight(el);
            this.highlightElement(el);
            this.createTooltip(el, step);
            this.addListeners();
        };
        this.ensureModalClosed = () => new Promise((resolve) => {
            // Cierra específicamente el modal objetivo si está abierto
            const m = document.getElementById('changeStatusModal');
            const isOpen = !!m && (m.classList.contains('show') || window.getComputedStyle(m).display === 'block');
            if (isOpen) this.hideModal('#changeStatusModal');
            // Cierra cualquier otro modal visible por seguridad
            document.querySelectorAll('.modal.show, .modal[style*="display: block"]').forEach(modal => {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
                modal.style.pointerEvents = 'none';
            });
            // Elimina backdrops residuales
            document.querySelectorAll('.modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show').forEach(b => b.remove());
            // Limpia estado del body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.classList.remove('modal-open');
            setTimeout(resolve, 100);
        });
        this.addListeners = () => {
            const next = document.getElementById('tutorial-next');
            const skip = document.getElementById('tutorial-skip');
            if (next) next.onclick = () => this.nextStep();
            if (skip) skip.onclick = () => this.endTutorial();
        };
        this.nextStep = async () => {
            const prev = this.tutorialSteps[this.currentStep];
            if (prev?.onNext) { try { await prev.onNext(); } catch {} }
            this.currentStep++;
            if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { this.endTutorial(); return; }
            this.removeHighlight(); this.removeTooltip();
            this.showStep(this.currentStep);
        };
        this.endTutorial = () => { this.isActive=false; this.removeHighlight(); this.removeTooltip(); if (this.overlay) this.overlay.remove(); };
    }
}

// TUTORIAL MÓDULO GESTIÓN ROSAL
class GestionRosalTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        this.tutorialSteps = [
            { selector: '#Row', title: 'Tabla de Tickets (Gestión Rosal)', description: 'Aquí gestionas los equipos en el Rosal: recibido, documentos, llaves y entrega a cliente.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },
            { selector: '.dt-buttons-container', title: 'Filtros de Estado', description: 'Usa estos filtros: Pendiente de Recibir, En el Rosal, Por confirmar llaves, Llaves Cargadas.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null },

            // Filtro 1: Pendiente por recibir en Rosal
            { selector: '#btn-por-asignar', title: 'Filtro: Pendiente por Confirmar Recibido', description: 'Muestra tickets con acción <strong>"En espera de Confirmar Devolución"</strong> o <strong>"En espera de confirmar recibido en el Rosal"</strong>.', position: 'bottom', waitFor: () => document.getElementById('btn-por-asignar') !== null, onNext: async () => { this.click('#btn-por-asignar'); await new Promise(r=>setTimeout(r,120)); await this.scrollToColumn('Acción'); } },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Aquí encontrarás las acciones disponibles según el tipo de ticket. Desplazando la tabla...', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: async () => { await this.scrollToColumn('Acción'); } },
            { selector: '#tabla-ticket tbody tr td .received-ticket-btn, #marcarrecibido', title: 'Acción: Marcar Recibido en Rosal', description: 'Botón con <strong>dos checkmarks</strong>: aparece <strong>solo en tickets "En espera de confirmar recibido en el Rosal"</strong>. Confirma la recepción física del equipo en el Rosal.', position: 'right', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .received-ticket-btn, #marcarrecibido') !== null, onShow: async () => { await this.scrollToColumn('Acción'); this.raise('.received-ticket-btn, #marcarrecibido'); }, onNext: () => { if (typeof this.restoreButtons === 'function') this.restoreButtons(); if (typeof this.hideButtons === 'function') this.hideButtons(['.received-ticket-btn', '#marcarrecibido']); } },
            { selector: '#tabla-ticket tbody tr td .view-document-btn, #viewimage, button.btn-secondary[title="No hay documento disponible"]', title: 'Campo: Visualizar Documentos', description: 'Permite ver los documentos cargados asociados al ticket (Nota de Entrega, Envío, etc.). Si no hay documento, se muestra deshabilitado.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .view-document-btn, #viewimage, button.btn-secondary[title="No hay documento disponible"]') !== null, onShow: () => this.raise('.view-document-btn, #viewimage, button.btn-secondary[title="No hay documento disponible"]'), onNext: () => { this.restoreButtons(); this.hideButtons(['#viewimage']); } },

            // Filtro 2: En el Rosal
            { selector: '#btn-asignados', title: 'Filtro: En el Rosal', description: 'Equipos en el Rosal listos para gestión (entrega, documentos).', position: 'bottom', waitFor: () => document.getElementById('btn-asignados') !== null, onShow: () => { this.restoreButtons(); this.hideButtons(['.view-document-btn', '#viewimage', '.upload-document-btn', '#openModalButton', '.send-to-region-btn', '.send-back-to-lab-btn']); }, onNext: () => this.click('#btn-asignados') },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando hasta la columna de acciones.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: async () => { await this.scrollToColumn('Acción'); } },
            { selector: '#tabla-ticket tbody tr td .deliver-ticket-btn, #tabla-ticket tbody tr td .deliver-ticket-bt', title: 'Acción: Entregar al Cliente', description: 'Marca el ticket como Entregado al Cliente y lo cierra, registrando la fecha de entrega.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .deliver-ticket-btn, #tabla-ticket tbody tr td .deliver-ticket-bt') !== null, onShow: () => this.raise('.deliver-ticket-btn, .deliver-ticket-bt') },
            { selector: '#tabla-ticket tbody tr td .upload-document-btn, #openModalButton', title: 'Acción: Subir Documento', description: 'Sube la Nota de Entrega u otro documento requerido para envío a región.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .upload-document-btn, #openModalButton') !== null, onShow: () => this.raise('.upload-document-btn, #openModalButton') },
            { selector: '#tabla-ticket tbody tr td .send-to-region-btn', title: 'Acción: Enviar a Región', description: 'Envía el equipo a la región destino cuando el documento está cargado.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .send-to-region-btn') !== null, onShow: () => this.raise('.send-to-region-btn') },
            { selector: '#tabla-ticket tbody tr td .view-document-btn, #viewimage', title: 'Ver Documento', description: 'Visualiza el documento cargado (imagen o PDF) en un modal.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .view-document-btn, #viewimage') !== null, onShow: () => this.raise('.view-document-btn, #viewimage'), onNext: () => { this.restoreButtons(); this.hideButtons(['.view-document-btn', '#viewimage', 'button.btn-secondary[title="No hay documento disponible"]']); } },
            { selector: '#tabla-ticket tbody tr td .send-back-to-lab-btn', title: 'Acción: Devolver a Taller', description: 'Devuelve el ticket al taller cuando es necesario reiniciar el proceso de reparación o revisión.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .send-back-to-lab-btn') !== null, onShow: async () => { await this.scrollToColumn('Taller'); this.raise('.send-back-to-lab-btn'); }, onNext: () => { this.restoreButtons(); this.hideButtons(['.send-back-to-lab-btn']); } },

            // Filtro 3: Por confirmar llaves
            { selector: '#btn-recibidos', title: 'Filtro: Por confirmar llaves', description: 'Tickets a la espera de confirmar la carga de llaves en el Rosal.', position: 'bottom', waitFor: () => document.getElementById('btn-recibidos') !== null, onShow: () => { this.restoreButtons(); this.hideButtons(['.view-document-btn', '#viewimage', '.upload-document-btn', '#openModalButton', '.send-to-region-btn', '.deliver-ticket-btn', '.deliver-ticket-bt', '.send-back-to-lab-btn']); }, onNext: async () => { this.click('#btn-recibidos'); await new Promise(r=>setTimeout(r,120)); await this.scrollToColumn('Llaves'); } },
            { selector: '#tabla-ticket tbody tr td .receive-key-checkbox', title: 'Acción: Confirmar Llaves (opcional)', description: 'Marca este checkbox si las llaves ya fueron cargadas.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .receive-key-checkbox') !== null, onShow: () => this.raise('.receive-key-checkbox') },

            // Filtro 4: Llaves Cargadas
            { selector: '#btn-llaves-cargadas', title: 'Filtro: Llaves Cargadas', description: 'Lista de tickets con llaves confirmadas.', position: 'bottom', waitFor: () => document.getElementById('btn-llaves-cargadas') !== null, onNext: () => this.click('#btn-llaves-cargadas') },

            // Selección y detalles
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Haremos clic en un ticket para ver sus detalles e historial.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstRow() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Aquí verás la información del ticket, serial y estados claves.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 },
            { selector: '#ticket-history-content', title: 'Historial del Ticket', description: 'Registro de gestiones y eventos del ticket.', position: 'left', waitFor: () => document.getElementById('ticket-history-content') !== null, isLastStep: true }
        ];

        // Helpers
        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.raise = (selector) => { const el = document.querySelector(selector); if (el) { el.style.position = 'relative'; el.style.zIndex = '10001'; } };
        this.scrollToActions = () => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 250);
            const lastCell = row.querySelector('td:last-child');
            const wrapper = table.closest('.dataTables_wrapper');
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: lastCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 250);
        });
        this.scrollToColumn = (columnHeaderText) => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 250);
            const wrapper = table.closest('.dataTables_wrapper');
            const scrollHead = wrapper?.querySelector('.dataTables_scrollHead table thead');
            const headers = scrollHead ? scrollHead.querySelectorAll('th') : table.querySelectorAll('thead th');
            let targetCell = null;
            headers.forEach((header, idx) => {
                if (header.textContent.trim() === columnHeaderText) {
                    const cells = row.querySelectorAll('td');
                    if (cells[idx]) targetCell = cells[idx];
                }
            });
            if (!targetCell) return setTimeout(resolve, 250);
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: targetCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 250);
        });
        this.selectFirstRow = () => new Promise(resolve => {
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (row) { row.click(); setTimeout(resolve, 500); } else setTimeout(resolve, 250);
        });

        this.hideModal = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return;
            try { if (typeof $ !== 'undefined' && typeof $(el).modal === 'function') { $(el).modal('hide'); } } catch(_){}
            try { const inst = bootstrap?.Modal?.getInstance ? bootstrap.Modal.getInstance(el) : null; if (inst) inst.hide(); else if (bootstrap?.Modal) new bootstrap.Modal(el).hide(); } catch(_){}
            el.classList.remove('show'); el.style.display='none'; el.style.visibility='hidden'; el.setAttribute('aria-hidden','true');
            document.querySelectorAll('.modal-backdrop, .modal-backdrop.fade, .modal-backdrop.show').forEach(b=>b.remove());
            document.body.classList.remove('modal-open'); document.documentElement.classList.remove('modal-open');
            document.body.style.overflow=''; document.body.style.paddingRight='';
        };

        this.startTutorial = () => { if (this.isActive) return; this.isActive = true; this.currentStep = 0; this.createOverlay(); this.showStep(0); };
        this.createOverlay = () => { this.overlay = document.createElement('div'); this.overlay.id='tutorial-overlay'; this.overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;'; document.body.appendChild(this.overlay); };
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>100){rej();return;} setTimeout(tick,60);} ; tick(); });
        this.prepareElementForHighlight = async (el) => {
            return new Promise(resolve => {
                const mainContainer = document.querySelector('main.main-content');
                if (!mainContainer || !el.closest('main.main-content')) {
                    // Si no hay main o el elemento no está dentro de main, scroll normal de ventana
                    const r = el.getBoundingClientRect();
                    const cy = r.top + r.height/2;
                    const vc = window.innerHeight/2;
                    if (Math.abs(cy - vc) > 40) {
                        window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' });
                        return setTimeout(resolve, 400);
                    } else {
                        return resolve();
                    }
                }
                // SCROLL DENTRO DEL MAIN
                const mainRect = mainContainer.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const elementTopInMain = elRect.top - mainRect.top + mainContainer.scrollTop;
                const mainVisibleHeight = mainContainer.clientHeight;
                if (elementTopInMain < mainContainer.scrollTop || 
                    elementTopInMain + elRect.height > mainContainer.scrollTop + mainVisibleHeight) {
                    const targetScroll = elementTopInMain - (mainVisibleHeight / 2) + (elRect.height / 2);
                    mainContainer.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    return setTimeout(resolve, 800);
                } else {
                    resolve();
                }
            });
        };
        this.highlightElement = (el) => { this.highlightedElement = el; const r = el.getBoundingClientRect(); const h = document.createElement('div'); h.id='tutorial-highlight'; h.style.cssText=`position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`; document.body.appendChild(h); };
        this.createTooltip = (el, step) => { const t=document.createElement('div'); t.id='tutorial-tooltip'; const r=el.getBoundingClientRect(); const w=380; let top,left; if(step.position==='bottom'){ top=r.bottom+40; left=r.left + r.width/2 - w/2; } else if(step.position==='top'){ top=r.top-220; left=r.left + r.width/2 - w/2; } else if(step.position==='left'){ top=r.top + r.height/2 - 100; left=r.left - w - 24; } else if(step.position==='right'){ top=r.top + r.height/2 - 100; left=r.right + 24; } else { top=r.top + r.height/2 - 100; left=r.left + r.width/2 - w/2; } left=Math.max(15, Math.min(left, window.innerWidth - w - 15)); top=Math.max(15, Math.min(top, window.innerHeight - 220)); const isLast=step.isLastStep; t.style.cssText=`position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`; t.innerHTML=`<style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style><h4 style="margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;">${step.title}</h4><p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${step.description}</p><div style="display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;"><button id="tutorial-skip" style="background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">Saltar</button><button id="tutorial-next" style="background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">${isLast?'Finalizar':'Siguiente'}</button></div>`; document.body.appendChild(t); };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.showStep = async (idx) => { if (idx >= this.tutorialSteps.length) return this.endTutorial(); const step = this.tutorialSteps[idx]; try { if (step.waitFor) await this.waitForCondition(step.waitFor); } catch { this.nextStep(); return; } const el = document.querySelector(step.selector); if (!el) { this.nextStep(); return; } if (typeof this.restoreButtons === 'function') { this.restoreButtons(); } if (typeof this.forceResetRaisedButtons === 'function') { this.forceResetRaisedButtons(); } if (step.onShow) { try { await step.onShow(); } catch {} } this.removeHighlight(); this.removeTooltip(); await this.prepareElementForHighlight(el); this.highlightElement(el); this.createTooltip(el, step); this.addListeners(); };
        this.addListeners = () => { const next=document.getElementById('tutorial-next'); const skip=document.getElementById('tutorial-skip'); if(next) next.onclick=()=>this.nextStep(); if(skip) skip.onclick=()=>this.endTutorial(); };
        this.nextStep = async () => { const prev = this.tutorialSteps[this.currentStep]; if (prev?.onNext) { try { await prev.onNext(); } catch {} } this.currentStep++; if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { this.endTutorial(); return; } this.removeHighlight(); this.removeTooltip(); this.showStep(this.currentStep); };
        this.endTutorial = () => {
        this.isActive = false;
        this.removeHighlight();
        this.removeTooltip();
        if (typeof this.restoreButtons === 'function') this.restoreButtons();
        if (this.overlay) this.overlay.remove();
        };    }
}

// TUTORIAL MÓDULO GESTIÓN REGIONES
class GestionRegionTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        this.tutorialSteps = [
            { selector: '#table-ticket-body', title: 'Tabla de Tickets (Regiones)', description: 'Aquí gestionas los equipos asignados a tu región: recibido en región, en la región y entregados al cliente.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },
            { selector: '#region-display', title: 'Región del Técnico', description: 'Este badge muestra la región asignada al usuario en sesión. Al hacer clic, podrás ver los estados asociados a tu región.', position: 'left', waitFor: () => document.getElementById('region-display') !== null, onShow: (step => { const rn = document.getElementById('region-name')?.textContent?.trim(); if (rn) step.description = `Esta es tu región: <strong>${rn}</strong>. Al continuar, la abriré para ver sus estados.`; }), onNext: () => { const badge = document.getElementById('region-display'); if (badge) badge.click(); } },
            { selector: '#states-container', title: 'Estados de la Región', description: 'Aquí se listan los estados asociados a tu región. Se muestran al hacer clic en el badge de región.', position: 'bottom', waitFor: () => { const c = document.getElementById('states-container'); if (!c) return false; const style = window.getComputedStyle(c); return style.display !== 'none' && c.offsetHeight > 0; } },
            { selector: '.dt-buttons-container', title: 'Filtros de Estado', description: 'Usa estos filtros: Pendiente por Confirmar Recibido, En la Región y Entregados al Cliente. Te muestro la fila completa para que ubiques rápidamente los filtros.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null, onShow: () => { const badge = document.getElementById('region-display'); const cont = document.getElementById('states-container'); try { if (badge && cont && window.getComputedStyle(cont).display !== 'none') badge.click(); } catch(_) {} if (cont) cont.style.display = 'none'; try { this.applyBlueEmphasis('.dt-buttons-container'); } catch(_) {} }, onNext: () => { try { this.clearBlueEmphasis(); } catch(_) {} } },

            // 1) Pendiente por confirmar recibido en Región
            { selector: '#btn-por-asignar', title: 'Filtro: Pendiente por Confirmar Recibido', description: 'Muestra tickets con acción <strong>"En espera de confirmar recibido en Región"</strong>.', position: 'bottom', waitFor: () => document.getElementById('btn-por-asignar') !== null, onNext: async () => { const b=document.getElementById('btn-por-asignar'); if (b) b.click(); await new Promise(r=>setTimeout(r,120)); await this.scrollToColumn('Acción'); } },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando a la columna de acciones.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: async () => { await this.scrollToColumn('Acción'); await new Promise(r=>setTimeout(r,180)); } },
            { selector: '#tabla-ticket tbody tr td .received-ticket-btn', title: 'Acción: Marcar Recibido en Región', description: 'Confirma que el equipo fue recibido físicamente en tu región.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .received-ticket-btn') !== null, onShow: () => this.raise('.received-ticket-btn'), onNext: () => { this.restoreButtons(); this.hideButtons(['.received-ticket-btn']); } },

            // 2) En la Región
            { selector: '#btn-recibidos', title: 'Filtro: En la Región', description: 'Tickets que están actualmente en tu región.', position: 'bottom', waitFor: () => document.getElementById('btn-recibidos') !== null, onShow: () => { this.restoreButtons(); this.hideButtons(['.received-ticket-btn']); }, onNext: async () => { const b=document.getElementById('btn-recibidos'); if (b) b.click(); await new Promise(r=>setTimeout(r,120)); await this.scrollToColumn('Acción'); } },
            { selector: '#tabla-ticket tbody tr td .btn-document-actions-modal', title: 'Ver Documentos', description: 'Permite visualizar los documentos relacionados (Nota de Entrega, Exoneración, Pago).', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-document-actions-modal') !== null, onShow: async () => { await this.scrollToColumn('Vizualizar Documentos'); await new Promise(r=>setTimeout(r,150)); this.raise('.btn-document-actions-modal'); }, onNext: () => { this.restoreButtons(); this.hideButtons(['.btn-document-actions-modal']); } },
            { selector: '#tabla-ticket tbody tr td .deliver-ticket-btn, #tabla-ticket tbody tr td .deliver-ticket-bt', title: 'Acción: Entregar al Cliente', description: 'Marca el ticket como Entregado al Cliente y cierra la gestión.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .deliver-ticket-btn, #tabla-ticket tbody tr td .deliver-ticket-bt') !== null, onShow: () => this.raise('.deliver-ticket-btn, .deliver-ticket-bt') },

            // 3) Entregados
            { selector: '#btn-asignados', title: 'Filtro: Entregados al Cliente', description: 'Tickets ya entregados y cerrados. Referencia histórica.', position: 'bottom', waitFor: () => document.getElementById('btn-asignados') !== null, onNext: () => { const b=document.getElementById('btn-asignados'); if (b) b.click(); } },
            { selector: '#tabla-ticket tbody tr td .btn-document-actions-modal', title: 'Ver Documentos (Entregados)', description: 'Permite visualizar los documentos finales del ticket ya entregado (Envió, Exoneración, Pago, Envío a Destino).', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .btn-document-actions-modal') !== null, onShow: async () => { await this.scrollToColumn('Vizualizar Documentos'); await new Promise(r=>setTimeout(r,150)); this.raise('.btn-document-actions-modal'); }, onNext: () => { this.restoreButtons(); this.hideButtons(['.btn-document-actions-modal']); } },

            // Detalles
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Selecciona un ticket para ver sus detalles.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstRow() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Visualiza información del ticket, serial y estados.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 },
            { selector: '.btn-secondary[onclick^="printHistory"]', title: 'Imprimir Historial', description: 'Genera un PDF con el historial del ticket para respaldo.', position: 'top', waitFor: () => document.querySelector('.btn-secondary[onclick^="printHistory"]') !== null, onShow: () => this.raise('.btn-secondary[onclick^="printHistory"]'), onNext: () => { this.restoreButtons(); } },
            { selector: '#ticket-history-content', title: 'Historial del Ticket', description: 'Registro de gestiones y eventos del ticket.', position: 'left', waitFor: () => document.getElementById('ticket-history-content') !== null, isLastStep: true }
        ];

        // Helpers
        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.raise = (selector) => { const el = document.querySelector(selector); if (el) { el.style.position='relative'; el.style.zIndex='10001'; el.style.boxShadow='0 0 0 4px rgba(0,123,255,.45), 0 0 16px rgba(0,123,255,.8)'; } };
        this.applyBlueEmphasis = (selector) => { const el=document.querySelector(selector); if(!el) return; this._emphasisEl = el; this._prevEmphasisStyle = el.getAttribute('style')||''; el.style.position='relative'; el.style.zIndex='10001'; el.style.background='rgba(0,123,255,0.10)'; el.style.boxShadow='0 0 0 3px #0d6efd inset, 0 0 20px rgba(13,110,253,.35)'; el.style.borderRadius='10px'; el.style.padding='8px 10px'; };
        this.clearBlueEmphasis = () => { if(!this._emphasisEl) return; this._emphasisEl.setAttribute('style', this._prevEmphasisStyle||''); this._emphasisEl = null; this._prevEmphasisStyle = null; };
        this.restoreButtons = () => { ['.received-ticket-btn','.btn-document-actions-modal','.deliver-ticket-btn','.deliver-ticket-bt','.btn-secondary[onclick^="printHistory"]'].forEach(s => { document.querySelectorAll(s).forEach(b => { b.style.zIndex=''; b.style.position=''; b.style.boxShadow=''; b.style.visibility=''; b.style.pointerEvents=''; }); }); };
        this.hideButtons = (selectors) => { selectors.forEach(s => document.querySelectorAll(s).forEach(el => { el.style.visibility='hidden'; el.style.pointerEvents='none'; el.style.zIndex=''; el.style.position=''; el.style.boxShadow=''; })); };
        this.scrollToColumn = (columnHeaderText) => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 250);
            const wrapper = table.closest('.dataTables_wrapper');
            const scrollHead = wrapper?.querySelector('.dataTables_scrollHead table thead');
            const headers = scrollHead ? scrollHead.querySelectorAll('th') : table.querySelectorAll('thead th');
            let targetCell = null;
            headers.forEach((header, idx) => {
                if (header.textContent.trim() === columnHeaderText) {
                    const cells = row.querySelectorAll('td');
                    if (cells[idx]) targetCell = cells[idx];
                }
            });
            if (!targetCell) return setTimeout(resolve, 250);
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: targetCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 250);
        });
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>100){rej();return;} setTimeout(tick,60);} ; tick(); });
        this.prepareElementForHighlight = async (el) => { const r = el.getBoundingClientRect(); const cy = r.top + r.height/2; const vc = window.innerHeight/2; if (Math.abs(cy - vc) > 120) { window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 400)); } };
        this.highlightElement = (el) => { this.highlightedElement = el; const r = el.getBoundingClientRect(); const h = document.createElement('div'); h.id='tutorial-highlight'; h.style.cssText=`position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`; document.body.appendChild(h); };
        this.createTooltip = (el, step) => { const t=document.createElement('div'); t.id='tutorial-tooltip'; const r=el.getBoundingClientRect(); const w=380; let top,left; if(step.position==='bottom'){ top=r.bottom+40; left=r.left + r.width/2 - w/2; } else if(step.position==='top'){ top=r.top-220; left=r.left + r.width/2 - w/2; } else if(step.position==='left'){ top=r.top + r.height/2 - 100; left=r.left - w - 24; } else if(step.position==='right'){ top=r.top + r.height/2 - 100; left=r.right + 24; } else { top=r.top + r.height/2 - 100; left=r.left + r.width/2 - w/2; } left=Math.max(15, Math.min(left, window.innerWidth - w - 15)); top=Math.max(15, Math.min(top, window.innerHeight - 220)); const isLast=step.isLastStep; t.style.cssText=`position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`; t.innerHTML=`<style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style><h4 style="margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;">${step.title}</h4><p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${step.description}</p><div style="display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;"><button id="tutorial-skip" style="background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">Saltar</button><button id="tutorial-next" style="background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;">${isLast?'Finalizar':'Siguiente'}</button></div>`; document.body.appendChild(t); };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.startTutorial = () => { if (this.isActive) return; this.isActive = true; this.currentStep = 0; this.createOverlay(); this.showStep(0); };
        this.createOverlay = () => { this.overlay = document.createElement('div'); this.overlay.id='tutorial-overlay'; this.overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;'; document.body.appendChild(this.overlay); };
        this.showStep = async (idx) => { if (idx >= this.tutorialSteps.length) return this.endTutorial(); const step = this.tutorialSteps[idx]; try { if (step.waitFor) await this.waitForCondition(step.waitFor); } catch { this.nextStep(); return; } if (typeof this.restoreButtons==='function') this.restoreButtons(); this.removeHighlight(); this.removeTooltip(); let el = document.querySelector(step.selector); if (!el) { this.nextStep(); return; } if (step.onShow) { try { await step.onShow(); } catch {} } el = document.querySelector(step.selector) || el; await this.prepareElementForHighlight(el); this.highlightElement(el); this.createTooltip(el, step); this.addListeners(); };
        this.addListeners = () => { const next=document.getElementById('tutorial-next'); const skip=document.getElementById('tutorial-skip'); if(next) next.onclick=()=>this.nextStep(); if(skip) skip.onclick=()=>this.endTutorial(); };
        this.nextStep = async () => { const prev = this.tutorialSteps[this.currentStep]; if (prev?.onNext) { try { await prev.onNext(); } catch {} } this.currentStep++; if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { this.endTutorial(); return; } this.removeHighlight(); this.removeTooltip(); this.showStep(this.currentStep); };
        this.endTutorial = () => { this.isActive=false; this.removeHighlight(); this.removeTooltip(); if (typeof this.restoreButtons==='function') this.restoreButtons(); if (this.overlay) this.overlay.remove(); };
        this.selectFirstRow = () => new Promise(resolve => { const row = document.querySelector('#tabla-ticket tbody tr'); if (row) { row.click(); setTimeout(resolve, 500); } else setTimeout(resolve, 250); });
    }
}

// TUTORIAL MÓDULO GESTIÓN DE PERIFÉRICO/COMPONENTES
class GestionComponentesTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        this.tutorialSteps = [
            { selector: 'Table-compo', title: 'Periférico POS', description: 'Aquí gestionas los periféricos asociados a los equipos POS.', position: 'top', waitFor: () => !!document.querySelector('#tabla-ticket') },
            { selector: '#tabla-ticket', title: 'Tabla de Tickets', description: 'Listado de tickets con su serial y un botón para ver los componentes del POS.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando lateralmente para localizar el botón de componentes.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: async () => { await this.scrollToColumn('Acciones'); await new Promise(r=>setTimeout(r,180)); } },
            { selector: '#tabla-ticket tbody tr td .ver-componentes-btn', title: 'Botón: Ver Componentes', description: 'Abre el detalle de periféricos del POS seleccionado. Primero haré clic para mostrar la información.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .ver-componentes-btn') !== null, onShow: async () => { await this.scrollToColumn('Acciones'); await new Promise(r=>setTimeout(r,180)); this.raise('.ver-componentes-btn'); }, onNext: () => { const btn = document.querySelector('#tabla-ticket tbody tr td .ver-componentes-btn'); if (btn) { this.hideButton('.ver-componentes-btn'); btn.click(); } } },
            { selector: '.swal2-html-container .pos-modal-container, .pos-modal-container', title: 'Información del POS y Periféricos', description: 'En este modal verás el banco, modelo y los periféricos registrados por módulo de gestión. El botón "Ver Componentes" fue ocultado para no distraer.', position: 'top', waitFor: () => document.querySelector('.pos-modal-container') !== null, onShow: () => { this.hideButton('.ver-componentes-btn'); }, onNext: async () => { await this.closeModal(); await new Promise(r=>setTimeout(r,500)); } },
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Haciendo clic en un ticket para ver sus detalles en el panel lateral.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstTicket() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Aquí se muestran los detalles del ticket seleccionado.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 && !document.getElementById('ticket-details-panel').textContent.includes('Selecciona un ticket') },
            { selector: '#hiperbinComponents', title: 'Cargar Periféricos del Dispositivo', description: 'Este botón te permite cargar y asociar periféricos/componentes al equipo POS del ticket seleccionado.', position: 'left', waitFor: () => document.getElementById('hiperbinComponents') !== null, onShow: () => this.raise('#hiperbinComponents') },
            { selector: '.btn-secondary[onclick^="printHistory"]', title: 'Imprimir Historial', description: 'Este botón genera y descarga en PDF el historial completo de gestiones del ticket.', position: 'top', waitFor: () => document.querySelector('.btn-secondary[onclick^="printHistory"]') !== null, onShow: () => this.raise('.btn-secondary[onclick^="printHistory"]') },
            { selector: '#ticketHistoryAccordion', title: 'Historial del Ticket', description: 'Aquí se muestra el historial completo de gestiones del ticket, con todas las acciones realizadas y sus fechas.', position: 'left', waitFor: () => document.getElementById('ticketHistoryAccordion') !== null, isLastStep: true }
        ];

        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.raise = (selector) => { const el=document.querySelector(selector); if (el) { el.style.position='relative'; el.style.zIndex='10001'; el.style.boxShadow='0 0 0 4px rgba(0,123,255,.45), 0 0 16px rgba(0,123,255,.8)'; } };
        this.hideButton = (selector) => { document.querySelectorAll(selector).forEach(btn => { btn.style.visibility = 'hidden'; btn.style.opacity = '0'; }); };
        this.restoreButtons = () => { 
            ['.ver-componentes-btn', '#hiperbinComponents', '.btn-secondary[onclick^="printHistory"]'].forEach(sel => {
                document.querySelectorAll(sel).forEach(btn => { 
                    btn.style.visibility = ''; 
                    btn.style.opacity = ''; 
                    btn.style.zIndex = ''; 
                    btn.style.position = ''; 
                    btn.style.boxShadow = ''; 
                }); 
            }); 
        };
        this.closeModal = async () => {
            // Cerrar modal de SweetAlert2
            if (typeof Swal !== 'undefined' && Swal.isVisible()) {
                Swal.close();
                await new Promise(r => setTimeout(r, 300));
            }
            // También intentar cerrar cualquier modal de Bootstrap
            document.querySelectorAll('.swal2-container, .modal.show').forEach(modal => {
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
            // Remover backdrops
            document.querySelectorAll('.swal2-backdrop-show, .modal-backdrop').forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open', 'swal2-height-auto');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
        this.selectFirstTicket = () => {
            return new Promise(resolve => {
                const row = document.querySelector('#tabla-ticket tbody tr');
                if (row) {
                    row.click();
                    setTimeout(resolve, 800);
                } else {
                    setTimeout(resolve, 300);
                }
            });
        };
        this.scrollToColumn = (columnHeaderText) => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 250);
            const wrapper = table.closest('.dataTables_wrapper');
            const scrollHead = wrapper?.querySelector('.dataTables_scrollHead table thead');
            const headers = scrollHead ? scrollHead.querySelectorAll('th') : table.querySelectorAll('thead th');
            let targetCell = null;
            headers.forEach((header, idx) => {
                if (header.textContent.trim() === columnHeaderText) {
                    const cells = row.querySelectorAll('td');
                    if (cells[idx]) targetCell = cells[idx];
                }
            });
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (targetCell && scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: targetCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 250);
        });
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>100){rej();return;} setTimeout(tick,60);} ; tick(); });
        this.prepareElementForHighlight = async (el) => { const r = el.getBoundingClientRect(); const cy = r.top + r.height/2; const vc = window.innerHeight/2; if (Math.abs(cy - vc) > 120) { window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 400)); } };
        this.highlightElement = (el) => { this.highlightedElement = el; const r = el.getBoundingClientRect(); const h = document.createElement('div'); h.id='tutorial-highlight'; h.style.cssText=`position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`; document.body.appendChild(h); };
        this.createTooltip = (el, step) => { const t=document.createElement('div'); t.id='tutorial-tooltip'; const r=el.getBoundingClientRect(); const w=380; let top,left; if(step.position==='bottom'){ top=r.bottom+40; left=r.left + r.width/2 - w/2; } else if(step.position==='top'){ top=r.top-220; left=r.left + r.width/2 - w/2; } else if(step.position==='left'){ top=r.top + r.height/2 - 100; left=r.left - w - 24; } else if(step.position==='right'){ top=r.top + r.height/2 - 100; left=r.right + 24; } else { top=r.top + r.height/2 - 100; left=r.left + r.width/2 - w/2; } left=Math.max(15, Math.min(left, window.innerWidth - w - 15)); top=Math.max(15, Math.min(top, window.innerHeight - 220)); const isLast=step.isLastStep; t.style.cssText=`position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`; t.innerHTML=`<style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style><h4 style=\"margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;\">${step.title}</h4><p style=\"margin:0;color:#333;font-size:15px;line-height:1.6;\">${step.description}</p><div style=\"display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;\"><button id=\"tutorial-skip\" style=\"background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;\">Saltar</button><button id=\"tutorial-next\" style=\"background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;\">${isLast?'Finalizar':'Siguiente'}</button></div>`; document.body.appendChild(t); };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.startTutorial = () => { if (this.isActive) return; this.isActive = true; this.currentStep = 0; this.createOverlay(); this.showStep(0); };
        this.createOverlay = () => { this.overlay = document.createElement('div'); this.overlay.id='tutorial-overlay'; this.overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;'; document.body.appendChild(this.overlay); };
        this.showStep = async (idx) => { 
            if (idx >= this.tutorialSteps.length) return this.endTutorial(); 
            const step = this.tutorialSteps[idx]; 
            try { 
                if (step.waitFor) await this.waitForCondition(step.waitFor); 
            } catch { 
                this.nextStep(); 
                return; 
            } 
            // Restaurar botones antes de mostrar un nuevo paso (excepto si es un paso de botón)
            const isButtonStep = step.title.includes('Botón:') || step.title === 'Cargar Periféricos del Dispositivo' || step.title === 'Imprimir Historial';
            if (!isButtonStep) {
                this.restoreButtons();
            }
            if (step.onShow) { 
                try { 
                    await step.onShow(); 
                } catch (e) {
                    console.warn('Error en onShow:', e);
                } 
            } 
            const el = document.querySelector(step.selector); 
            if (!el) { 
                console.warn(`Elemento no encontrado: ${step.selector}`);
                this.nextStep(); 
                return; 
            } 
            this.removeHighlight(); 
            this.removeTooltip(); 
            await this.prepareElementForHighlight(el); 
            this.highlightElement(el); 
            this.createTooltip(el, step); 
            this.addListeners(); 
        };
        this.addListeners = () => { const next=document.getElementById('tutorial-next'); const skip=document.getElementById('tutorial-skip'); if(next) next.onclick=()=>this.nextStep(); if(skip) skip.onclick=()=>this.endTutorial(); };
        this.nextStep = async () => { 
            const prev = this.tutorialSteps[this.currentStep]; 
            if (prev?.onNext) { 
                try { 
                    await prev.onNext(); 
                } catch (e) {
                    console.warn('Error en onNext:', e);
                } 
            } 
            this.currentStep++; 
            if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { 
                this.endTutorial(); 
                return; 
            } 
            this.removeHighlight(); 
            this.removeTooltip(); 
            this.showStep(this.currentStep); 
        };
        this.endTutorial = () => { 
            this.isActive=false; 
            this.removeHighlight(); 
            this.removeTooltip(); 
            this.restoreButtons();
            if (this.overlay) this.overlay.remove(); 
        };
    }
}

// TUTORIAL MÓDULO VERIFICACIÓN DE SOLVENCIA DE DOMICILIACIÓN
class GestionDomiciliacionTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.highlightedElement = null;

        this.tutorialSteps = [
            { selector: '#Tabla-Domiciliacion', title: 'Verificación de Solvencia de Domiciliación', description: 'En este módulo gestionas la verificación de solvencia de tickets relacionados con domiciliaciones bancarias.', position: 'top', waitFor: () => !!document.querySelector('#tabla-ticket') },
            { selector: '#tabla-ticket', title: 'Tabla de Tickets', description: 'Listado de tickets con información de domiciliación: razón social, RIF, serial POS, estado de taller y estado de domiciliación.', position: 'top', waitFor: () => document.getElementById('tabla-ticket') !== null },
            { selector: '.dt-buttons-container', title: 'Filtros de Estado', description: 'Usa estos 5 botones para filtrar tickets por estado de domiciliación: Pendiente por revisar, Solvente, Gestión Comercial, Convenio Firmado y Desafiliado con Deuda.', position: 'bottom', waitFor: () => document.querySelector('.dt-buttons-container') !== null },
            { selector: '#btn-pendiente-revisar', title: 'Filtro: Pendiente por Revisar', description: 'Muestra tickets pendientes por revisar la domiciliación. Este es el estado inicial de los tickets.', position: 'bottom', waitFor: () => document.getElementById('btn-pendiente-revisar') !== null, onNext: () => this.clickFilter('#btn-pendiente-revisar') },
            { selector: '#btn-solvente', title: 'Filtro: Solvente', description: 'Tickets donde el cliente está al día con sus pagos. Estado solvente confirmado.', position: 'bottom', waitFor: () => document.getElementById('btn-solvente') !== null, onNext: () => this.clickFilter('#btn-solvente') },
            { selector: '#btn-gestion-comercial', title: 'Filtro: Gestión Comercial', description: 'Tickets en espera de respuesta del cliente. Requieren seguimiento comercial.', position: 'bottom', waitFor: () => document.getElementById('btn-gestion-comercial') !== null, onNext: () => this.clickFilter('#btn-gestion-comercial') },
            { selector: '#btn-convenio-firmado', title: 'Filtro: Convenio Firmado', description: 'Tickets donde el cliente ha firmado un convenio de pago. Aquí puedes adjuntar o visualizar el documento del convenio.', position: 'bottom', waitFor: () => document.getElementById('btn-convenio-firmado') !== null, onNext: () => this.clickFilter('#btn-convenio-firmado') },
            { selector: '#tabla-ticket tbody tr td:last-child', title: 'Columna de Acciones', description: 'Desplazando lateralmente para visualizar las acciones disponibles en los tickets.', position: 'left', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onShow: async () => { await this.scrollToColumn('Acciones'); await new Promise(r=>setTimeout(r,180)); } },
            { selector: '#tabla-ticket tbody tr td .cambiar-estatus-domiciliacion-btn', title: 'Botón: Cambiar Estatus', description: 'Abre el modal para cambiar el estatus de domiciliación del ticket. Útil para actualizar el estado del proceso.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .cambiar-estatus-domiciliacion-btn') !== null },
            { selector: '#tabla-ticket tbody tr td .adjuntar-documento-btn', title: 'Botón: Adjuntar Documento de Convenio', description: 'En el estado "Convenio Firmado" usa este botón para adjuntar el documento del convenio firmado por el cliente.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .adjuntar-documento-btn') !== null },
            { selector: '#tabla-ticket tbody tr td .visualizar-documento-btn', title: 'Botón: Visualizar Documento de Convenio', description: 'Cuando el convenio ya está cargado, este botón abre el documento para visualizarlo o verificarlo.', position: 'bottom', waitFor: () => document.querySelector('#tabla-ticket tbody tr td .visualizar-documento-btn') !== null },
            { selector: '#tabla-ticket tbody tr', title: 'Seleccionar Ticket', description: 'Haciendo clic en un ticket para ver sus detalles en el panel lateral.', position: 'top', waitFor: () => document.querySelector('#tabla-ticket tbody tr') !== null, onNext: () => this.selectFirstTicket() },
            { selector: '#ticket-details-panel', title: 'Panel de Detalles', description: 'Aquí se muestran los detalles completos del ticket seleccionado: información del cliente, serial POS, estados y fechas relevantes.', position: 'left', waitFor: () => document.getElementById('ticket-details-panel')?.children.length > 0 && !document.getElementById('ticket-details-panel').textContent.includes('Selecciona un ticket') },
            { selector: '#ticket-history-content, #ticketHistoryAccordion', title: 'Historial del Ticket', description: 'Aquí se muestra el historial completo de gestiones realizadas sobre el ticket, incluyendo cambios de estatus y acciones de domiciliación.', position: 'left', waitFor: () => document.getElementById('ticket-history-content') || document.getElementById('ticketHistoryAccordion'), isLastStep: true }
        ];

        this.click = (selector) => { const el = document.querySelector(selector); if (el) el.click(); };
        this.clickFilter = (selector) => { 
            const btn = document.querySelector(selector);
            if (btn && !btn.classList.contains('btn-primary')) {
                btn.click();
                return new Promise(resolve => setTimeout(resolve, 500));
            }
            return Promise.resolve();
        };
        this.raise = (selector) => { 
            document.querySelectorAll(selector).forEach(el => {
                if (el) { 
                    el.style.position='relative'; 
                    el.style.zIndex='10001'; 
                    el.style.boxShadow='0 0 0 4px rgba(0,123,255,.45), 0 0 16px rgba(0,123,255,.8)'; 
                }
            });
        };
        this.restoreButtons = () => { 
            ['.cambiar-estatus-domiciliacion-btn', '.adjuntar-documento-btn', '.visualizar-documento-btn'].forEach(sel => {
                document.querySelectorAll(sel).forEach(btn => { 
                    btn.style.visibility = ''; 
                    btn.style.opacity = ''; 
                    btn.style.zIndex = ''; 
                    btn.style.position = ''; 
                    btn.style.boxShadow = ''; 
                }); 
            }); 
        };
        this.selectFirstTicket = () => {
            return new Promise(resolve => {
                const row = document.querySelector('#tabla-ticket tbody tr');
                if (row) {
                    row.click();
                    setTimeout(resolve, 800);
                } else {
                    setTimeout(resolve, 300);
                }
            });
        };
        this.scrollToColumn = (columnHeaderText) => new Promise(resolve => {
            const table = document.getElementById('tabla-ticket');
            const row = document.querySelector('#tabla-ticket tbody tr');
            if (!table || !row) return setTimeout(resolve, 250);
            const wrapper = table.closest('.dataTables_wrapper');
            const scrollHead = wrapper?.querySelector('.dataTables_scrollHead table thead');
            const headers = scrollHead ? scrollHead.querySelectorAll('th') : table.querySelectorAll('thead th');
            let targetCell = null;
            headers.forEach((header, idx) => {
                if (header.textContent.trim() === columnHeaderText) {
                    const cells = row.querySelectorAll('td');
                    if (cells[idx]) targetCell = cells[idx];
                }
            });
            const scroller = wrapper?.querySelector('.dataTables_scrollBody') || wrapper || table.parentElement;
            if (targetCell && scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: targetCell.offsetLeft, behavior: 'smooth' });
                return setTimeout(resolve, 500);
            }
            setTimeout(resolve, 250);
        });
        this.waitForCondition = (fn) => new Promise((res, rej) => { let n=0; const tick=()=>{ try{ if(fn()){res();return;} }catch{} if(n++>100){rej();return;} setTimeout(tick,60);} ; tick(); });
        this.prepareElementForHighlight = async (el) => { const r = el.getBoundingClientRect(); const cy = r.top + r.height/2; const vc = window.innerHeight/2; if (Math.abs(cy - vc) > 120) { window.scrollTo({ top: window.pageYOffset + cy - vc, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 400)); } };
        this.highlightElement = (el) => { this.highlightedElement = el; const r = el.getBoundingClientRect(); const h = document.createElement('div'); h.id='tutorial-highlight'; h.style.cssText=`position:fixed;top:${r.top-6}px;left:${r.left-6}px;width:${r.width+12}px;height:${r.height+12}px;border:4px solid #007bff;border-radius:12px;background:rgba(0,123,255,0.15);z-index:9999;pointer-events:none;animation:pulse 1.5s infinite;`; document.body.appendChild(h); };
        this.createTooltip = (el, step) => { const t=document.createElement('div'); t.id='tutorial-tooltip'; const r=el.getBoundingClientRect(); const w=380; let top,left; if(step.position==='bottom'){ top=r.bottom+40; left=r.left + r.width/2 - w/2; } else if(step.position==='top'){ top=r.top-220; left=r.left + r.width/2 - w/2; } else if(step.position==='left'){ top=r.top + r.height/2 - 100; left=r.left - w - 24; } else if(step.position==='right'){ top=r.top + r.height/2 - 100; left=r.right + 24; } else { top=r.top + r.height/2 - 100; left=r.left + r.width/2 - w/2; } left=Math.max(15, Math.min(left, window.innerWidth - w - 15)); top=Math.max(15, Math.min(top, window.innerHeight - 220)); const isLast=step.isLastStep; t.style.cssText=`position:fixed;top:${top}px;left:${left}px;width:${w}px;background:white;border:3px solid #007bff;border-radius:18px;padding:24px;box-shadow:0 16px 40px rgba(0,0,0,0.28);z-index:10000;font-family:'Segoe UI',sans-serif;animation:popIn 0.3s ease;`; t.innerHTML=`<style>@keyframes popIn{from{opacity:0;transform:scale(.9) translateY(-10px)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,123,255,.4)}50%{box-shadow:0 0 0 12px rgba(0,123,255,0)}}</style><h4 style=\"margin:0 0 14px;color:#007bff;font-weight:700;font-size:20px;\">${step.title}</h4><p style=\"margin:0;color:#333;font-size:15px;line-height:1.6;\">${step.description}</p><div style=\"display:flex;justify-content:flex-end;gap:14px;margin-top:20px;padding-top:16px;border-top:1px solid #eee;\"><button id=\"tutorial-skip\" style=\"background:#6c757d;color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;\">Saltar</button><button id=\"tutorial-next\" style=\"background:${isLast?'#28a745':'#007bff'};color:white;border:none;padding:11px 20px;border-radius:12px;font-size:14px;cursor:pointer;font-weight:600;\">${isLast?'Finalizar':'Siguiente'}</button></div>`; document.body.appendChild(t); };
        this.removeHighlight = () => { const h=document.getElementById('tutorial-highlight'); if(h) h.remove(); };
        this.removeTooltip = () => { const t=document.getElementById('tutorial-tooltip'); if(t) t.remove(); };
        this.startTutorial = () => { if (this.isActive) return; this.isActive = true; this.currentStep = 0; this.createOverlay(); this.showStep(0); };
        this.createOverlay = () => { this.overlay = document.createElement('div'); this.overlay.id='tutorial-overlay'; this.overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9998;'; document.body.appendChild(this.overlay); };
        this.showStep = async (idx) => { 
            if (idx >= this.tutorialSteps.length) return this.endTutorial(); 
            const step = this.tutorialSteps[idx]; 
            try { 
                if (step.waitFor) await this.waitForCondition(step.waitFor); 
            } catch { 
                this.nextStep(); 
                return; 
            } 
            const isButtonStep = step.title.includes('Botón:') || step.title.includes('Filtro:');
            if (!isButtonStep) {
                this.restoreButtons();
            }
            if (step.onShow) { 
                try { 
                    await step.onShow(); 
                } catch (e) {
                    console.warn('Error en onShow:', e);
                } 
            } 
            const el = typeof step.selector === 'function' ? step.selector() : document.querySelector(step.selector); 
            if (!el) { 
                console.warn(`Elemento no encontrado: ${typeof step.selector === 'function' ? '(función selector)' : step.selector}`);
                this.nextStep(); 
                return; 
            } 
            this.removeHighlight(); 
            this.removeTooltip(); 
            await this.prepareElementForHighlight(el); 
            this.highlightElement(el); 
            this.createTooltip(el, step); 
            this.addListeners(); 
        };
        this.addListeners = () => { const next=document.getElementById('tutorial-next'); const skip=document.getElementById('tutorial-skip'); if(next) next.onclick=()=>this.nextStep(); if(skip) skip.onclick=()=>this.endTutorial(); };
        this.nextStep = async () => { 
            const prev = this.tutorialSteps[this.currentStep]; 
            if (prev?.onNext) { 
                try { 
                    await prev.onNext(); 
                } catch (e) {
                    console.warn('Error en onNext:', e);
                } 
            } 
            this.currentStep++; 
            if (this.currentStep >= this.tutorialSteps.length || prev?.isLastStep) { 
                this.endTutorial(); 
                return; 
            } 
            this.removeHighlight(); 
            this.removeTooltip(); 
            this.showStep(this.currentStep); 
        };
        this.endTutorial = () => { 
            this.isActive=false; 
            this.removeHighlight(); 
            this.removeTooltip(); 
            this.restoreButtons();
            if (this.overlay) this.overlay.remove(); 
        };
    }
}

// ASISTENTE VIRTUAL
class VirtualAssistant {
    constructor() {
        this.panel = null;
        this.overlay = null;
        this.avatar = null;
        this.isPanelOpen = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.panelPosition = { x: 0, y: 0 };
        this.ticketTutorial = new TicketManagementTutorial();
        this.rifTutorial = new ConsultaRIFTutorial();
        this.gestioncoordinacionTutorial = new GestionCoordinadorTutorial();
        this.GestionTecnicoTutorial = new GestionTecnicoTutorial();
        this.GestionTallerTutorial = new GestionTallerTutorial();
        this.GestionRosalTutorial = new GestionRosalTutorial();
        this.GestionRegionTutorial = new GestionRegionTutorial();
        this.GestionComponentesTutorial = new GestionComponentesTutorial();
        this.GestionDomiciliacionTutorial = new GestionDomiciliacionTutorial();
        this.init();
    }
    
    init() {
        this.createAssistantHTML();
        this.bindEvents();
        this.showWelcomeAnimation();
    }
    
    createAssistantHTML() {
        // Crear el contenedor del asistente
        const assistantContainer = document.createElement('div');
        assistantContainer.className = 'virtual-assistant-container';
        assistantContainer.innerHTML = `
            <div class="assistant-avatar" id="assistantAvatar">
                <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" 
                     alt="Asistente Virtual" 
                     class="assistant-img"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOS4zMzMgMTQgNCAxNS43NzkxIDQgMTlIMjBDMjAgMTUuNzc5MSAxOC42NjcgMTQgMTYgMTRIMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'">
                <div class="speech-bubble" id="speechBubble">
                    <div class="bubble-content">
                        <span class="bubble-text">¿En qué te puedo ayudar?</span>
                        <div class="bubble-tail"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Crear el panel de chat
        const panel = document.createElement('div');
        panel.className = 'assistant-panel chat-panel';
        panel.id = 'assistantPanel';
        panel.innerHTML = `
            <div class="assistant-panel-header" id="panelHeader">
                <div class="assistant-info">
                    <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" 
                         alt="Asistente" 
                         class="panel-avatar"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjIuNSIgY3k9IjIyLjUiIHI9IjIyLjUiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSIxMSIgeT0iMTEiIHdpZHRoPSIyMyIgaGVpZ2h0PSIyMyIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOS4zMzMgMTQgNCAxNS43NzkxIDQgMTlIMjBDMjAgMTUuNzc5MSAxOC42NjcgMTQgMTYgMTRIMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'">
                    <div class="assistant-details">
                        <h5 class="assistant-name">Intelix - Asistente Virtual</h5>
                        <span class="assistant-status">En línea</span>
                    </div>
                </div>
                <div class="panel-controls">
                    <div class="drag-indicator" title="Arrastra para mover">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                    </div>
                    <button class="reset-position" id="resetPosition" title="Centrar ventana">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                    </button>
                    <button class="close-panel" id="closePanel">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="chat-container">
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant-message welcome-msg">
                        <div class="message-avatar">
                            <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" alt="Ana" class="msg-avatar">
                        </div>
                        <div class="message-content">
                            <div class="message-bubble">
                                <p>¡Hola! Soy Intelix, tu asistente virtual. Puedo ayudarte con consultas inteligentes del sistema.</p>
                                <p><strong>¿En qué te puedo ayudar hoy?</strong></p>
                            </div>
                            <div class="message-time">Ahora</div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-options" id="chatOptions">
                    <!-- Categoría Técnico -->
                    <div class="category-section">
                        <div class="category-header" data-category="tecnico">
                            <div class="category-title">
                                <span class="category-icon">👨‍💼</span>
                                <span class="category-name">Técnico</span>
                            </div>
                            <div class="category-arrow">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="category-options" id="tecnico-options" style="display: none;">
                            <button class="chat-option-btn" data-query="technician_individual_efficiency">
                                <span class="option-icon">📋</span>
                                <span class="option-text">Eficiencia de un técnico específico</span>
                            </button>
                            <button class="chat-option-btn" data-query="tickets_efficiency_summary">
                                <span class="option-icon">📊</span>
                                <span class="option-text">Eficiencia de técnicos en general</span>
                            </button>
                            <button class="chat-option-btn" data-query="pending_tickets">
                                <span class="option-icon">⏳</span>
                                <span class="option-text">Tickets pendientes</span>
                            </button>
                        </div>
                    </div>

                    <!-- Categoría Ayuda -->
                    <div class="category-section">
                        <div class="category-header" data-category="ayuda">
                            <div class="category-title">
                                <span class="category-icon">❓</span>
                                <span class="category-name">Ayuda</span>
                            </div>
                            <div class="category-arrow">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="category-options" id="ayuda-options" style="display: none;">
                            <button class="chat-option-btn" data-query="help_general">
                                <span class="option-icon">💡</span>
                                <span class="option-text">Ayuda general del sistema</span>
                            </button>
                            <button class="chat-option-btn" data-query="help_tickets">
                                <span class="option-icon">🎫</span>
                                <span class="option-text">Cómo gestionar tickets</span>
                            </button>
                            <button class="chat-option-btn" data-query="help_reports">
                                <span class="option-icon">📊</span>
                                <span class="option-text">Cómo generar reportes</span>
                            </button>
                            <button class="chat-option-btn" data-query="help_technical">
                                <span class="option-icon">🔧</span>
                                <span class="option-text">Soporte técnico</span>
                            </button>
                            <button class="chat-option-btn" data-query="help_tutorial">
                                <span class="option-icon">🎓</span>
                                <span class="option-text">Tutorial de gestión de tickets</span>
                            </button>
                        </div>
                    </div>

                    <!-- Categoría Sistema -->
                    <div class="category-section">
                        <div class="category-header" data-category="sistema">
                            <div class="category-title">
                                <span class="category-icon">⚙️</span>
                                <span class="category-name">Sistema</span>
                            </div>
                            <div class="category-arrow">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="category-options" id="sistema-options" style="display: none;">
                            <button class="chat-option-btn" data-query="system_health">
                                <span class="option-icon">💚</span>
                                <span class="option-text">Estado del sistema</span>
                            </button>
                            <button class="chat-option-btn" data-query="system_performance">
                                <span class="option-icon">📈</span>
                                <span class="option-text">Rendimiento del sistema</span>
                            </button>
                            <button class="chat-option-btn" data-query="system_logs">
                                <span class="option-icon">📝</span>
                                <span class="option-text">Logs del sistema</span>
                            </button>
                        </div>
                    </div>

                    <!-- Categoría Clientes -->
                    <div class="category-section">
                        <div class="category-header" data-category="clientes">
                            <div class="category-title">
                                <span class="category-icon">🏢</span>
                                <span class="category-name">Clientes</span>
                            </div>
                            <div class="category-arrow">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="category-options" id="clientes-options" style="display: none;">
                            <button class="chat-option-btn" data-query="client_analysis">
                                <span class="option-icon">📊</span>
                                <span class="option-text">Análisis de clientes</span>
                            </button>
                            <button class="chat-option-btn" data-query="client_satisfaction">
                                <span class="option-icon">😊</span>
                                <span class="option-text">Satisfacción de clientes</span>
                            </button>
                            <button class="chat-option-btn" data-query="client_tickets">
                                <span class="option-icon">🎫</span>
                                <span class="option-text">Tickets por cliente</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="chat-loading" id="chatLoading" style="display: none;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p>Ana está procesando tu consulta...</p>
                </div>
            </div>
        `;
        
        // Crear overlay de fondo
        const overlay = document.createElement('div');
        overlay.className = 'assistant-overlay';
        overlay.id = 'assistantOverlay';
        
        // Agregar al DOM
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        
        // Agregar al sidenav footer existente o crear uno nuevo
        const sidenav = document.getElementById('sidenav-main');
        if (sidenav) {
            // Buscar si ya existe un footer
            let sidenavFooter = sidenav.querySelector('.sidenav-footer');
            if (!sidenavFooter) {
                // Crear footer si no existe
                sidenavFooter = document.createElement('div');
                sidenavFooter.className = 'sidenav-footer mx-3';
                sidenav.appendChild(sidenavFooter);
            }
            
            // Limpiar el footer existente y agregar solo el asistente
            sidenavFooter.innerHTML = '';
            sidenavFooter.appendChild(assistantContainer);
        }
        
        // Guardar referencias
        this.panel = panel;
        this.overlay = overlay;
        this.avatar = document.getElementById('assistantAvatar');
    }
    
    bindEvents() {
        // Click en el avatar
        if (this.avatar) {
            this.avatar.addEventListener('click', () => {
                this.togglePanel();
            });
        }
        
        // Click en cerrar panel
        const closeBtn = document.getElementById('closePanel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closePanel();
            });
        }
        
        // Click en resetear posición
        const resetBtn = document.getElementById('resetPosition');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetPanelPosition();
            });
        }
        
        // Click en overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closePanel();
            });
        }
        
        // Click en headers de categorías
        const categoryHeaders = document.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                this.toggleCategory(category);
            });
        });
        
        // Click en botones de chat
        const chatOptions = document.querySelectorAll('.chat-option-btn');
        chatOptions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.currentTarget.getAttribute('data-query');
                this.handleChatQuery(query, e.currentTarget);
            });
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPanelOpen) {
                this.closePanel();
            }
        });
        
        // Eventos de arrastre
        this.bindDragEvents();
    }
    
    bindDragEvents() {
        const panelHeader = document.getElementById('panelHeader');
        if (!panelHeader) return;
        
        // Prevenir selección de texto durante el arrastre
        panelHeader.style.userSelect = 'none';
        
        // Mouse events
        panelHeader.addEventListener('mousedown', (e) => {
            this.startDrag(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            this.drag(e);
        });
        
        document.addEventListener('mouseup', (e) => {
            this.endDrag(e);
        });
        
        // Touch events para dispositivos móviles
        panelHeader.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e.touches[0]);
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        
        document.addEventListener('touchend', (e) => {
            this.endDrag(e);
        });
    }
    
    startDrag(e) {
        if (!this.isPanelOpen) return;
        
        this.isDragging = true;
        const panelRect = this.panel.getBoundingClientRect();
        
        this.dragOffset.x = e.clientX - panelRect.left;
        this.dragOffset.y = e.clientY - panelRect.top;
        
        // Cambiar cursor y agregar clase de arrastre
        document.body.style.cursor = 'grabbing';
        this.panel.classList.add('dragging');
        
        // Prevenir eventos por defecto
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging || !this.isPanelOpen) return;
        
        // Calcular nueva posición
        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;
        
        // Limitar movimiento dentro de la ventana
        const maxX = window.innerWidth - this.panel.offsetWidth;
        const maxY = window.innerHeight - this.panel.offsetHeight;
        
        this.panelPosition.x = Math.max(0, Math.min(newX, maxX));
        this.panelPosition.y = Math.max(0, Math.min(newY, maxY));
        
        // Aplicar nueva posición
        this.panel.style.left = `${this.panelPosition.x}px`;
        this.panel.style.top = `${this.panelPosition.y}px`;
        this.panel.style.transform = 'none'; // Remover transform centrado
        
        e.preventDefault();
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // Restaurar cursor y remover clase de arrastre
        document.body.style.cursor = '';
        this.panel.classList.remove('dragging');
        
        // Guardar posición en localStorage
        this.savePanelPosition();
        
        e.preventDefault();
    }
    
    savePanelPosition() {
        localStorage.setItem('chatbotPanelPosition', JSON.stringify(this.panelPosition));
    }
    
    loadPanelPosition() {
        const saved = localStorage.getItem('chatbotPanelPosition');
        if (saved) {
            this.panelPosition = JSON.parse(saved);
            return true;
        }
        return false;
    }
    
    resetPanelPosition() {
        this.panelPosition = { x: 0, y: 0 };
        this.panel.style.left = '';
        this.panel.style.top = '';
        this.panel.style.transform = 'translate(-50%, -50%)';
        this.savePanelPosition();
    }
    
    togglePanel() {
        if (this.isPanelOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }
    
    openPanel() {
        this.isPanelOpen = true;
        this.panel.classList.add('show');
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Siempre aparecer centrado cuando se abre
        this.panel.style.left = '';
        this.panel.style.top = '';
        this.panel.style.transform = 'translate(-50%, -50%)';
        
        // Log para debugging
        console.log('🤖 Panel del asistente virtual abierto - Posición centrada');
    }
    
    closePanel() {
        this.isPanelOpen = false;
        this.panel.classList.remove('show');
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Borrar el chat al cerrar
        this.clearChat();
        
        // Log para debugging
        console.log('🤖 Panel del asistente virtual cerrado - Chat borrado');
    }
    
    // Función para borrar el chat (manteniendo mensaje inicial de Ana y posición del panel)
    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Guardar la posición actual del panel antes de borrar
            const currentLeft = this.panel.style.left;
            const currentTop = this.panel.style.top;
            const currentTransform = this.panel.style.transform;
            
            // Buscar el mensaje inicial de Ana
            const initialMessage = chatMessages.querySelector('.message.assistant-message');
            
            // Si hay un mensaje inicial de Ana, mantenerlo
            if (initialMessage && initialMessage.textContent.includes('¡Hola! Soy Ana')) {
                // Borrar todo y volver a agregar solo el mensaje inicial
                chatMessages.innerHTML = '';
                chatMessages.appendChild(initialMessage);
                console.log('🤖 Chat borrado - Manteniendo mensaje inicial de Ana');
            } else {
                // Si no hay mensaje inicial, borrar todo
                chatMessages.innerHTML = '';
                console.log('🤖 Chat completamente borrado');
            }
            
            // Restaurar la posición del panel
            this.panel.style.left = currentLeft;
            this.panel.style.top = currentTop;
            this.panel.style.transform = currentTransform;
        }
    }
    
    toggleCategory(categoryName) {
        const targetOptions = document.getElementById(`${categoryName}-options`);
        const targetHeader = document.querySelector(`[data-category="${categoryName}"]`);
        
        if (!targetOptions || !targetHeader) {
            console.log(`🤖 No se encontró la categoría "${categoryName}"`);
            return;
        }
        
        // Verificar si la categoría actual está abierta
        const isCurrentlyOpen = targetOptions.style.display !== 'none' && targetHeader.classList.contains('active');
        
        if (isCurrentlyOpen) {
            // Si está abierta, cerrarla
            targetOptions.style.display = 'none';
            targetHeader.classList.remove('active');
            const arrow = targetHeader.querySelector('.category-arrow svg');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
            console.log(`🤖 Categoría "${categoryName}" cerrada`);
        } else {
            // Si está cerrada, cerrar todas las demás y abrir esta
            const allCategoryOptions = document.querySelectorAll('.category-options');
            const allCategoryHeaders = document.querySelectorAll('.category-header');
            
            allCategoryOptions.forEach(options => {
                options.style.display = 'none';
            });
            
            allCategoryHeaders.forEach(header => {
                header.classList.remove('active');
                const arrow = header.querySelector('.category-arrow svg');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
            
            // Abrir la categoría seleccionada
            targetOptions.style.display = 'block';
            targetHeader.classList.add('active');
            const arrow = targetHeader.querySelector('.category-arrow svg');
            if (arrow) {
                arrow.style.transform = 'rotate(90deg)';
            }
            
            // Animación suave
            targetOptions.style.opacity = '0';
            targetOptions.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                targetOptions.style.transition = 'all 0.3s ease';
                targetOptions.style.opacity = '1';
                targetOptions.style.transform = 'translateY(0)';
            }, 10);
            
            console.log(`🤖 Categoría "${categoryName}" abierta`);
        }
    }
    
    handleChatQuery(query, buttonElement) {
        console.log(`🤖 Consulta IA: ${query}`);
        
        // Obtener el texto del botón
        const queryText = buttonElement.querySelector('.option-text').textContent;
        
        // Deshabilitar botón temporalmente
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.6';
        
        // Verificar si es una consulta de ayuda que se maneja localmente
        const localHelpQueries = ['help_general', 'help_tickets', 'help_reports', 'help_technical', 'help_tutorial'];
        
        if (localHelpQueries.includes(query)) {
            // Mostrar indicador de carga
            this.showChatLoading();
            
            // Esperar un poco antes de agregar el mensaje del usuario para evitar superposición
            setTimeout(() => {
                // Agregar mensaje del usuario después de un delay
                this.addUserMessage(queryText);
                
                // Procesar la consulta local después de agregar el mensaje del usuario
                setTimeout(() => {
                    this.processLocalHelpQuery(query);
                    buttonElement.disabled = false;
                    buttonElement.style.opacity = '1';
                }, 500); // Delay adicional para separar mensaje del usuario de la respuesta
            }, 200); // Delay inicial para evitar superposición
        } else {
            // Mostrar indicador de carga
            this.showChatLoading();
            
            // Esperar un poco antes de agregar el mensaje del usuario para evitar superposición
            setTimeout(() => {
                // Agregar mensaje del usuario después de un delay
                this.addUserMessage(queryText);
                
                // Procesar la consulta IA después de agregar el mensaje del usuario
                setTimeout(() => {
                    this.processAIQuery(query);
                    buttonElement.disabled = false;
                    buttonElement.style.opacity = '1';
                }, 500); // Delay adicional para separar mensaje del usuario de la respuesta
            }, 200); // Delay inicial para evitar superposición
        }
    }
    
    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p style = "color: white;">${message}</p>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addAssistantMessage(message, data = null) {
        console.log('🤖 addAssistantMessage llamada con:', message, data);
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        
        let messageContent = message;
        if (data) {
            if (data.type === 'custom') {
                // Para tipo custom, usar directamente el HTML
                messageContent = data.html || message;
            } else {
                messageContent += this.formatDataResponse(data);
            }
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" alt="Ana" class="msg-avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    ${messageContent}
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        console.log('🤖 Mensaje agregado al DOM');
        
        // Forzar scroll después de agregar el mensaje
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    }
    
    showChatLoading() {
        const chatLoading = document.getElementById('chatLoading');
        const chatOptions = document.getElementById('chatOptions');
        
        chatOptions.style.display = 'none';
        chatLoading.style.display = 'block';
    }
    
    hideChatLoading() {
        const chatLoading = document.getElementById('chatLoading');
        const chatOptions = document.getElementById('chatOptions');
        
        chatLoading.style.display = 'none';
        chatOptions.style.display = 'block';
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async processAIQuery(query, params = {}) {
        try {
            console.log('🤖 processAIQuery llamada con:', query, params);
            
            // Hacer consulta real a la API
            const bodyParams = { action: query, ...params };
            console.log('🤖 Parámetros enviados:', bodyParams);
            
            const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/ai/${query}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(bodyParams)
            });

            console.log('🤖 Respuesta recibida:', response);
            console.log('🤖 Status:', response.status);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('🤖 Resultado JSON:', result);
            
            if (result.success) {
                // Procesar respuesta exitosa
                this.hideChatLoading();
                this.processSuccessfulResponse(query, result.data);
            } else {
                throw new Error(result.message || 'Error en la consulta');
            }
        } catch (error) {
            console.error('🤖 Error en consulta IA:', error);
            this.hideChatLoading();
            this.addAssistantMessage('❌ Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo en un momento.');
        }
    }

  processSuccessfulResponse(query, data) {
    let text; // Declarar text fuera del switch para evitar problemas de ámbito

    // Función auxiliar para redondear a 2 decimales
    const formatNumber = (num) => {
        return parseFloat(num).toFixed(2);
    };

    switch (query) {
        case 'tickets_efficiency_summary':
            // Validar que todos los datos necesarios estén presentes
            if (!data.total_tickets_count || !data.percentage_open || !data.percentage_in_process || !data.percentage_resolved || !data.efficiency) {
                this.addAssistantMessage('Error: Datos incompletos recibidos del servidor.');
                return;
            }

            // Determinar el mensaje basado en el porcentaje de tickets en proceso
            if (parseFloat(data.percentage_in_process) > 50) {
                text = `pero más de la mitad`;
            } else {
                text = `pero menos de la mitad`;
            }

            // PRIMER MENSAJE: Solo el análisis de texto
            this.addAssistantMessage(
                `Un <span style="color: #4CAF50">${formatNumber(data.efficiency)}%</span> de eficiencia indica que los técnicos han completado una proporción moderada del total de tickets que son ${data.total_tickets_count}, de los cuales hay ` +
                `(<span style="color: #36A2EB">${formatNumber(data.percentage_resolved)}% cerrados</span>) ${text} en proceso (<span style="color: #FFCE56">${formatNumber(data.percentage_in_process)}%</span>) y hay una cantidad de tickets abiertos de (<span style="color: #FF6384">${formatNumber(data.percentage_open)}%</span>)`
            );

            // SEGUNDO MENSAJE: Solo la gráfica (separado)
            setTimeout(() => {
                this.addChartMessage(data);
            }, 1000); // Delay mayor para asegurar separación visual
            break;

        case 'tickets_stats':
            this.addAssistantMessage(
                '📊 Aquí tienes las estadísticas actuales de tickets:',
                {
                    type: 'stats',
                    data: data
                }
            );
            break;

        case 'technician_individual_efficiency':
            // Mostrar lista de técnicos para seleccionar
            console.log('🤖 Datos recibidos para technician_individual_efficiency:', data);
            this.showTechnicianSelection(data);
            break;

        case 'technician_performance':
            // Mostrar rendimiento del técnico seleccionado
            this.showTechnicianPerformance(data);
            break;

        case 'pending_tickets':
            // Mostrar configuración de días críticos y tickets pendientes
            this.showPendingTicketsWithConfig(data);
            break;

        case 'tickets_by_priority':
            // Mostrar lista de tickets por prioridad específica
            this.showTicketsList(data);
            break;

        case 'client_analysis':
            this.addAssistantMessage(
                '🏢 Análisis inteligente de clientes:',
                {
                    type: 'clients',
                    data: data
                }
            );
            break;

        case 'system_health':
            this.addAssistantMessage(
                '💚 Estado actual del sistema:',
                {
                    type: 'system',
                    data: data
                }
            );
            break;

        case 'ticket_management_tutorial':
            // Mostrar selección de módulos para tutorial
            this.showModuleTutorialSelection();
            break;

        default:
            this.addAssistantMessage('Lo siento, no pude procesar esa consulta. ¿Podrías intentar con otra opción?');
    }
}

// Función para agregar gráfica de tickets (modificada)
addChartMessage(data) {
    const chartId = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Función local para formatear números con solo 2 decimales
    const formatNumber = (num) => {
        const numValue = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(numValue)) return '0.00';
        return numValue.toFixed(2);
    };
    
    // Convertir los datos a números
    const resolved = parseFloat(data.percentage_resolved) || 0;
    const inProcess = parseFloat(data.percentage_in_process) || 0;
    const open = parseFloat(data.percentage_open) || 0;
    
    const chartHtml = `
        <div class="chart-container" style="margin-top: 20px; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
            <h5 style="text-align: center; color: #333; margin-bottom: 20px; font-weight: bold;">
                <i class="fas fa-chart-pie me-2"></i>Distribución de Tickets
            </h5>
            <div style="position: relative; height: 350px; width: 100%; margin-bottom: 25px;">
                <canvas id="${chartId}" width="400" height="350"></canvas>
            </div>
        </div>
        <div style="height: 20px; clear: both;"></div>
    `;

    // Crear un mensaje separado para la gráfica
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" alt="Ana" class="msg-avatar">
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${chartHtml}
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Forzar scroll después de agregar el mensaje
    setTimeout(() => {
        this.scrollToBottom();
    }, 50);

    // Crear la gráfica después de que se renderice el HTML
    setTimeout(() => {
        this.createTicketChart(chartId, data);
        // Scroll adicional después de crear la gráfica
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }, 100);
}



    // Función para crear la gráfica con Chart.js
    createTicketChart(chartId, data) {
        const ctx = document.getElementById(chartId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tickets Cerrados', 'Tickets En Proceso', 'Tickets Abiertos'],
                datasets: [{
                    data: [
                        data.percentage_resolved,
                        data.percentage_in_process,
                        data.percentage_open
                    ],
                    backgroundColor: [
                        '#36A2EB',  // Azul para cerrados
                        '#FFCE56',  // Amarillo para en proceso
                        '#FF6384'   // Rojo para abiertos
                    ],
                    borderColor: [
                        '#2E86C1',
                        '#F39C12',
                        '#E74C3C'
                    ],
                    borderWidth: 2,
                    hoverBackgroundColor: [
                        '#2E86C1',
                        '#F39C12',
                        '#E74C3C'
                    ],
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Usamos nuestra propia leyenda
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                return `${label}: ${value.toFixed(2)}% (${Math.round((value / 100) * data.total_tickets_count)} tickets)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                cutout: '50%' // Para hacer el efecto doughnut
            }
        });
    }

    // Función para mostrar la lista de técnicos para seleccionar
    showTechnicianSelection(technicians) {
        console.log('🤖 showTechnicianSelection llamada con:', technicians);
        console.log('🤖 Es array?', Array.isArray(technicians));
        console.log('🤖 Longitud:', technicians ? technicians.length : 'undefined');
        
        if (!technicians || !Array.isArray(technicians) || technicians.length === 0) {
            console.log('🤖 No se encontraron técnicos disponibles');
            this.addAssistantMessage('❌ No se encontraron técnicos disponibles.');
            return;
        }

        const techniciansHtml = `
            <div class="technician-selection-container" style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
                <h5 style="text-align: center; color: #333; margin-bottom: 20px; font-weight: bold;">
                    <i class="fas fa-users me-2"></i>Selecciona un Técnico
                </h5>
                <div class="technician-list" style="max-height: 300px; overflow-y: auto;">
                    ${technicians.map(tech => `
                        <div class="technician-item" style="margin-bottom: 10px; padding: 12px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="window.virtualAssistant.selectTechnician(${tech.id_user}, '${tech.name} ${tech.surname}')">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong style="color: #333; font-size: 14px;">${tech.name} ${tech.surname}</strong>
                                    <div style="font-size: 12px; color: #666; margin-top: 2px;">
                                        ${tech.email || 'Sin email'}
                                    </div>
                                </div>
                                <div style="color: #007bff; font-size: 18px;">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        console.log('🤖 HTML generado para técnicos:', techniciansHtml);
        
        // Crear mensaje con HTML directamente
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" alt="Ana" class="msg-avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    👨‍💼 Aquí tienes la lista de técnicos disponibles:
                    ${techniciansHtml}
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        console.log('🤖 Mensaje agregado al chat');
        
        // Forzar scroll después de agregar el mensaje
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    }

    // Función para seleccionar un técnico
    selectTechnician(technicianId, technicianName) {
        console.log('🤖 selectTechnician llamada con:', technicianId, technicianName);
        
        // Mostrar mensaje de carga
        this.addAssistantMessage(`🔍 Analizando el rendimiento de <strong>${technicianName}</strong>...`);
        
        // Hacer consulta para obtener el rendimiento del técnico
        this.processAIQuery('technician_performance', { technician_id: technicianId });
    }

    // Función para mostrar el rendimiento del técnico seleccionado
    showTechnicianPerformance(data) {
        console.log('🤖 showTechnicianPerformance llamada con:', data);
        
        if (!data) {
            console.log('🤖 No hay datos de rendimiento');
            this.addAssistantMessage('❌ No se pudo obtener el rendimiento del técnico.');
            return;
        }

        // Parsear recent_tickets si viene como string JSON
        let recentTickets = [];
        if (data.recent_tickets) {
            try {
                if (typeof data.recent_tickets === 'string') {
                    recentTickets = JSON.parse(data.recent_tickets);
                } else if (Array.isArray(data.recent_tickets)) {
                    recentTickets = data.recent_tickets;
                }
            } catch (e) {
                console.error('🤖 Error parseando recent_tickets:', e);
                recentTickets = [];
            }
        }

        console.log('🤖 recentTickets parseado:', recentTickets);

        const performanceHtml = `
            <div class="technician-performance-container" style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
                <h5 style="text-align: center; color: #333; margin-bottom: 20px; font-weight: bold;">
                    <i class="fas fa-chart-line me-2"></i>Rendimiento de ${data.technician_name}
                </h5>
                
                <div class="performance-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div class="stat-card" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #28a745;">${data.total_tickets || 0}</div>
                        <div style="font-size: 12px; color: #666;">Total Tickets</div>
                    </div>
                    <div class="stat-card" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #007bff;">${data.completed_tickets || 0}</div>
                        <div style="font-size: 12px; color: #666;">Completados</div>
                    </div>
                    <div class="stat-card" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${data.in_progress_tickets || 0}</div>
                        <div style="font-size: 12px; color: #666;">En Proceso</div>
                    </div>
                    <div class="stat-card" style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${data.open_tickets || 0}</div>
                        <div style="font-size: 12px; color: #666;">Abiertos</div>
                    </div>
                </div>

                <div class="performance-details" style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                        <div class="detail-item">
                            <span style="font-weight: bold; color: #333;">Eficiencia:</span>
                            <span style="color: #28a745; font-weight: bold;">${data.efficiency_percentage || 0}%</span>
                        </div>
                        <div class="detail-item">
                            <span style="font-weight: bold; color: #333;">Tasa de Completado:</span>
                            <span style="color: #007bff; font-weight: bold;">${data.completion_rate || 0}%</span>
                        </div>
                        <div class="detail-item">
                            <span style="font-weight: bold; color: #333;">Tiempo Promedio:</span>
                            <span style="color: #6c757d; font-weight: bold;">${data.average_time || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span style="font-weight: bold; color: #333;">Último Ticket:</span>
                            <span style="color: #6c757d; font-weight: bold;">${data.last_ticket_date_formatted || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                ${recentTickets && recentTickets.length > 0 ? `
                    <div class="recent-tickets" style="background-color: #ffffff; padding: 15px; border-radius: 8px;">
                        <h6 style="color: #333; margin-bottom: 15px; font-weight: bold;">
                            <i class="fas fa-history me-2"></i>Tickets Recientes
                        </h6>
                        <div style="max-height: 200px; overflow-y: auto;">
                            ${recentTickets.map(ticket => `
                                <div style="padding: 8px; border-bottom: 1px solid #e9ecef; font-size: 12px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-weight: bold;">#${ticket.nro_ticket}</span>
                                        <span style="color: ${ticket.status_color || '#6c757d'};">${ticket.status_name}</span>
                                    </div>
                                    <div style="color: #666; margin-top: 2px;">
                                        ${ticket.date_created || 'Sin fecha'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        console.log('🤖 HTML generado para rendimiento:', performanceHtml);
        
        // Crear mensaje con HTML directamente
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${APP_PATH}app/public/img/assistant/woman-avatar.png" alt="Ana" class="msg-avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    📊 Aquí tienes el análisis detallado del rendimiento:
                    ${performanceHtml}
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        console.log('🤖 Mensaje de rendimiento agregado al chat');
        
        // Forzar scroll después de agregar el mensaje
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    }

    
    formatDataResponse(data) {
        if (!data || !data.data) return '';
        
        let formatted = '';
        
        switch (data.type) {
            case 'stats':
                formatted = `
                    <div class="data-response">
                        <div class="stat-item">
                            <span class="stat-label">Total de Tickets:</span>
                            <span class="stat-value">${data.data.total_tickets_count}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">En Proceso:</span>
                            <span class="stat-value processing">${data.data.in_process_tickets_count}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Completados:</span>
                            <span class="stat-value completed">${data.data.resolved_tickets_count}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'performance':
                formatted = `
                    <div class="data-response">
                        <div class="performance-highlight">
                            <h6>🏆 Técnico Destacado</h6>
                            <p><strong>${data.data.top_technician}</strong></p>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tickets Resueltos:</span>
                            <span class="stat-value">${data.data.tickets_resueltos}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Satisfacción:</span>
                            <span class="stat-value satisfaction">${data.data.satisfaccion}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tiempo Promedio:</span>
                            <span class="stat-value">${data.data.tiempo_promedio}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'pending':
                formatted = `
                    <div class="data-response">
                        <div class="priority-item critical">
                            <span class="priority-label">🚨 Críticos:</span>
                            <span class="priority-value">${data.data.criticos}</span>
                        </div>
                        <div class="priority-item high">
                            <span class="priority-label">⚠️ Altos:</span>
                            <span class="priority-value">${data.data.altos}</span>
                        </div>
                        <div class="priority-item medium">
                            <span class="priority-label">📋 Medios:</span>
                            <span class="priority-value">${data.data.medios}</span>
                        </div>
                        <div class="priority-item low">
                            <span class="priority-label">✅ Bajos:</span>
                            <span class="priority-value">${data.data.bajos}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'clients':
                formatted = `
                    <div class="data-response">
                        <div class="stat-item">
                            <span class="stat-label">Clientes Activos:</span>
                            <span class="stat-value">${data.data.clientes_activos}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Satisfacción Promedio:</span>
                            <span class="stat-value satisfaction">${data.data.satisfaccion_promedio}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tickets por Cliente:</span>
                            <span class="stat-value">${data.data.tickets_por_cliente}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Cliente Más Activo:</span>
                            <span class="stat-value">${data.data.cliente_mas_activo}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'system':
                formatted = `
                    <div class="data-response">
                        <div class="system-status healthy">
                            <h6>💚 Sistema Saludable</h6>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Uptime:</span>
                            <span class="stat-value healthy">${data.data.uptime}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Rendimiento:</span>
                            <span class="stat-value healthy">${data.data.performance}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Usuarios Conectados:</span>
                            <span class="stat-value">${data.data.usuarios_conectados}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Carga del Servidor:</span>
                            <span class="stat-value healthy">${data.data.carga_servidor}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'custom':
                formatted = data.html || '';
                break;
                
        }
        
        return formatted;
    }
    
    showMessage(message) {
        // Crear mensaje temporal
        const messageDiv = document.createElement('div');
        messageDiv.className = 'assistant-temp-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
    
    showWelcomeAnimation() {
        // Mostrar animación de bienvenida después de 2 segundos
        setTimeout(() => {
            if (this.avatar) {
                this.avatar.style.animation = 'bounce 1s ease';
                setTimeout(() => {
                    this.avatar.style.animation = 'float 3s ease-in-out infinite';
                }, 1000);
            }
        }, 2000);
    }

    // Función para mostrar tickets pendientes con configuración de días críticos
    showPendingTicketsWithConfig(data) {
        console.log('🤖 showPendingTicketsWithConfig llamada con:', data);
        console.log('🤖 Tipo de data:', typeof data);
        console.log('🤖 Keys de data:', Object.keys(data || {}));
        
        if (!data) {
            this.addAssistantMessage('❌ No se pudieron obtener los tickets pendientes.');
            return;
        }

        const daysCritical = data.days_critical || 5;
        console.log('🤖 daysCritical:', daysCritical);
        
        // Generar ID único para el input
        const inputId = `daysCriticalInput_${Date.now()}`;
        
        const configHtml = `<div class="pending-tickets-container" style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
                <div class="config-section" style="margin-bottom: 20px; padding: 15px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef;">
                    <h6 style="color: #333; margin-bottom: 15px; font-weight: bold;">
                        <i class="fas fa-cog me-2"></i>Configuración de Prioridades
                    </h6>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <label style="font-weight: 500; color: #555;">Días para crítico:</label>
                        <input type="number" id="${inputId}" value="${daysCritical}" min="1" max="30" 
                               style="width: 80px; padding: 5px 8px; border: 1px solid #ddd; border-radius: 4px; text-align: center;">
                        <button onclick="window.virtualAssistant.updateDaysCritical('${inputId}')" 
                                style="padding: 5px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-sync-alt me-1"></i>Actualizar
                        </button>
                    </div>
                    <div style="font-size: 12px; color: #666; background-color: #f8f9fa; padding: 8px; border-radius: 4px;">
                        <strong>Lógica:</strong> Críticos ≥ ${daysCritical} días | Altos ≥ ${Math.round(daysCritical * 0.75)} días | Medios ≥ ${Math.round(daysCritical * 0.5)} días | Bajos < ${Math.round(daysCritical * 0.5)} días
                    </div>
                </div>
                
                <div class="priority-results" style="background-color: #ffffff; border-radius: 8px; padding: 15px;">
                    <h6 style="color: #333; margin-bottom: 15px; font-weight: bold;">
                        <i class="fas fa-exclamation-triangle me-2"></i>Tickets Pendientes (Mes Actual)
                    </h6>
                    <div class="priority-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                        <div class="priority-item critical" style="text-align: center; padding: 12px; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="window.virtualAssistant.showTicketsByPriority('critico', ${daysCritical})">
                            <div style="font-size: 24px; font-weight: bold;">${data.criticos || 0}</div>
                            <div style="font-size: 12px; font-weight: 500;">🚨 Críticos</div>
                            <div style="font-size: 10px; opacity: 0.9;">≥ ${daysCritical} días</div>
                        </div>
                        <div class="priority-item high" style="text-align: center; padding: 12px; background-color: #fd7e14; color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="window.virtualAssistant.showTicketsByPriority('alto', ${daysCritical})">
                            <div style="font-size: 24px; font-weight: bold;">${data.altos || 0}</div>
                            <div style="font-size: 12px; font-weight: 500;">⚠️ Altos</div>
                            <div style="font-size: 10px; opacity: 0.9;">≥ ${Math.round(daysCritical * 0.75)} días</div>
                        </div>
                        <div class="priority-item medium" style="text-align: center; padding: 12px; background-color: #ffc107; color: #333; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="window.virtualAssistant.showTicketsByPriority('medio', ${daysCritical})">
                            <div style="font-size: 24px; font-weight: bold;">${data.medios || 0}</div>
                            <div style="font-size: 12px; font-weight: 500;">📋 Medios</div>
                            <div style="font-size: 10px; opacity: 0.8;">≥ ${Math.round(daysCritical * 0.5)} días</div>
                        </div>
                        <div class="priority-item low" style="text-align: center; padding: 12px; background-color: #28a745; color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="window.virtualAssistant.showTicketsByPriority('bajo', ${daysCritical})">
                            <div style="font-size: 24px; font-weight: bold;">${data.bajos || 0}</div>
                            <div style="font-size: 12px; font-weight: 500;">✅ Bajos</div>
                            <div style="font-size: 10px; opacity: 0.9;">< ${Math.round(daysCritical * 0.5)} días</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addAssistantMessage('⏳ Tickets pendientes que requieren atención:', {
            type: 'custom',
            html: configHtml
        });
        
        console.log('🤖 Mensaje enviado con HTML personalizado');
    }

    // Función para actualizar días críticos
    updateDaysCritical(inputId) {
        const input = document.getElementById(inputId);
        
        if (!input) {
            console.error('🤖 No se encontró el input con ID:', inputId);
            this.addAssistantMessage('❌ Error: No se encontró el campo de configuración.');
            return;
        }
        
        const daysCritical = parseInt(input.value);
        
        if (isNaN(daysCritical) || daysCritical < 1 || daysCritical > 30) {
            this.addAssistantMessage('❌ Por favor ingresa un número válido entre 1 y 30 días.');
            return;
        }

        console.log('🤖 Actualizando días críticos a:', daysCritical);
        console.log('🤖 Input value:', input.value);
        console.log('🤖 Input ID:', inputId);
        
        // Mostrar mensaje de carga
        this.addAssistantMessage(`🔄 Actualizando prioridades con ${daysCritical} días críticos...`);
        
        // Hacer nueva consulta con los días críticos actualizados
        console.log('🤖 Enviando consulta con days_critical:', daysCritical);
        this.processAIQuery('pending_tickets', { days_critical: daysCritical });
    }

    // Función para mostrar tickets por prioridad específica
    showTicketsByPriority(priority, daysCritical) {
        console.log('🤖 showTicketsByPriority llamada con:', priority, daysCritical);
        
        // Mostrar mensaje de carga
        const priorityNames = {
            'critico': 'Críticos',
            'alto': 'Altos', 
            'medio': 'Medios',
            'bajo': 'Bajos'
        };
        
        this.addAssistantMessage(`🔍 Obteniendo tickets ${priorityNames[priority]}...`);
        
        // Hacer consulta para obtener los tickets específicos (solo prioridad)
        this.processAIQuery('tickets_by_priority', { 
            priority: priority 
        });
    }

    // Función para mostrar la lista de tickets por prioridad
    showTicketsList(data) {
        console.log('🤖 showTicketsList llamada con:', data);
        
        if (!data || !data.tickets) {
            this.addAssistantMessage('❌ No se pudieron obtener los tickets.');
            return;
        }

        const tickets = data.tickets;
        const priority = data.priority;
        const count = data.count || tickets.length;
        
        const priorityNames = {
            'critico': 'Críticos',
            'alto': 'Altos', 
            'medio': 'Medios',
            'bajo': 'Bajos'
        };
        
        const priorityColors = {
            'critico': '#dc3545',
            'alto': '#fd7e14', 
            'medio': '#ffc107',
            'bajo': '#28a745'
        };

            const ticketsHtml = `
                <div class="tickets-list-container" style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
                    <h6 style="color: #333; margin-bottom: 15px; font-weight: bold;">
                        <i class="fas fa-list me-2"></i>Tickets ${priorityNames[priority]} (${count} tickets)
                    </h6>
                    <div class="tickets-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                        ${tickets.map(ticket => `
                            <div class="ticket-item" style="padding: 12px; background-color: #ffffff; border-radius: 8px; border-left: 4px solid ${priorityColors[priority]}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
                                    #${ticket.nro_ticket}
                                </div>
                                <div style="font-size: 12px; color: #666; margin-bottom: 3px;">
                                    <strong>Técnico:</strong> ${ticket.tecnico_nombre || 'Sin asignar'}
                                </div>
                                <div style="font-size: 12px; color: #666; margin-bottom: 3px;">
                                    <strong>Días:</strong> ${ticket.dias_transcurridos} días
                                </div>
                                <div style="font-size: 12px; color: #666;">
                                    <strong>Asignado:</strong> ${ticket.fecha_asignacion ? new Date(ticket.fecha_asignacion).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        this.addAssistantMessage(`📋 Aquí tienes los tickets ${priorityNames[priority]}:`, {
            type: 'custom',
            html: ticketsHtml
        });
    }

    // Método para iniciar el tutorial de tickets
    startTicketTutorial() {
        this.closeModuleSelectionModal();

        // Solo redirigir si NO estamos en dashboard
        if (!window.location.pathname.includes('dashboard')) {
            window.location.href = 'dashboard';
            return;
        }

        // Si ya estamos en dashboard → iniciar tutorial directamente
        setTimeout(() => {
            if (this.ticketTutorial) {
        this.ticketTutorial.startTutorial();
            }
        }, 800);
    }

    startRifTutorial() {
        this.closeModuleSelectionModal();

        // Solo redirigir si NO estamos en dashboard
        if (!window.location.pathname.includes('consulta_rif')) {
            window.location.href = 'consulta_rif';
            return;
        }

        // Si ya estamos en dashboard → iniciar tutorial directamente
        setTimeout(() => {
            if (this.rifTutorial) {
        this.rifTutorial.startTutorial();
    }
        }, 800);

    }

    startGestionCoordinacionTutorial() {
        this.closeModuleSelectionModal();

        // Solo redirigir si NO estamos en dashboard
        if (!window.location.pathname.includes('asignar_tecnico')) {
            window.location.href = 'asignar_tecnico';
            return;
        }

        // Si ya estamos en dashboard → iniciar tutorial directamente
        setTimeout(() => {
            if (this.gestioncoordinacionTutorial) {
                this.gestioncoordinacionTutorial.startTutorial();
            }
        }, 800);
         this.gestioncoordinacionTutorial.startTutorial();
    }

    startTechnicianTutorial() {
        this.closeModuleSelectionModal();

        // Solo redirigir si NO estamos en dashboard
        if (!window.location.pathname.includes('tecnico')) {
            window.location.href = 'tecnico';
            return;
        }

        // Si ya estamos en dashboard → iniciar tutorial directamente
        setTimeout(() => {
            if (this.GestionTecnicoTutorial) {
                this.GestionTecnicoTutorial.startTutorial();
            }
        }, 800);
         this.GestionTecnicoTutorial.startTutorial();
    }

    startLabTutorial() {
        this.closeModuleSelectionModal();

        // Redirigir si no estamos en el módulo del taller
        if (!window.location.pathname.includes('taller')) {
            window.location.href = 'taller';
            return;
        }

        setTimeout(() => {
            if (this.GestionTallerTutorial) {
                this.GestionTallerTutorial.startTutorial();
            }
        }, 800);
        this.GestionTallerTutorial.startTutorial();
    }

    startRosalTutorial() {
        this.closeModuleSelectionModal();

        // Redirigir si no estamos en el módulo de Gestión Rosal
        if (!window.location.pathname.includes('pendiente_entrega')) {
            window.location.href = 'pendiente_entrega';
            return;
        }

        setTimeout(() => {
            if (this.GestionRosalTutorial) {
                this.GestionRosalTutorial.startTutorial();
            }
        }, 800);
        this.GestionRosalTutorial.startTutorial();
    }

    startRegionTutorial() {
        this.closeModuleSelectionModal();
        
        // Redirigir si no estamos en el módulo de Gestión por Región
        if (!window.location.pathname.includes('region')) {
            window.location.href = 'region';
            return;
        }
        
        setTimeout(() => {
            if (this.GestionRegionTutorial) {
                this.GestionRegionTutorial.startTutorial();
            }
        }
        , 800);
        this.GestionRegionTutorial.startTutorial();
    }

    startComponentesTutorial() {
        console.log('🎬 startComponentesTutorial llamado');
        this.closeModuleSelectionModal();
        
        // Verificar si estamos en el módulo correcto (con o sin acento)
        const pathname = window.location.pathname;
        const isInModule = pathname.includes('periférico_pos') || pathname.includes('periferico_pos') || decodeURIComponent(pathname).includes('periférico_pos');
        
        console.log(`📍 Pathname actual: ${pathname}`);
        console.log(`📍 ¿Estamos en el módulo? ${isInModule}`);

        if (!isInModule) {
            console.log('🔄 Redirigiendo a periférico_pos...');
            window.location.href = 'periférico_pos';
            return;
        }
        
        console.log('✅ Iniciando tutorial de componentes...');
        setTimeout(() => {
            if (this.GestionComponentesTutorial) {
                this.GestionComponentesTutorial.startTutorial();
            } else {
                console.error('❌ GestionComponentesTutorial no está definido');
            }
        }, 800);
    }

    startDomiciliacionTutorial() {
        console.log('🎬 startDomiciliacionTutorial llamado');
        this.closeModuleSelectionModal();
        
        const pathname = window.location.pathname;
        const isInModule = pathname.includes('domiciliacion') || decodeURIComponent(pathname).includes('domiciliacion');
        
        console.log(`📍 Pathname actual: ${pathname}`);
        console.log(`📍 ¿Estamos en el módulo? ${isInModule}`);

        if (!isInModule) {
            console.log('🔄 Redirigiendo a domiciliacion...');
            window.location.href = 'domiciliacion';
            return;
        }
        
        console.log('✅ Iniciando tutorial de domiciliación...');
        setTimeout(() => {
            if (this.GestionDomiciliacionTutorial) {
                this.GestionDomiciliacionTutorial.startTutorial();
            } else {
                console.error('❌ GestionDomiciliacionTutorial no está definido');
            }
        }, 800);
    }



    startReportsTutorial() {
        console.log('Iniciando tutorial: Reportes');
        // this.reportsTutorial.startT  utorial();
    }

    // Procesar consultas de ayuda localmente (sin hacer peticiones HTTP)
    processLocalHelpQuery(query) {
        console.log('🤖 Procesando consulta de ayuda local:', query);
        
        // Ocultar indicador de carga
        this.hideChatLoading();
        
        switch (query) {
            case 'help_general':
                this.addAssistantMessage(
                    '💡 **Ayuda General del Sistema**\n\n' +
                    'Bienvenido al sistema de gestión de tickets. Aquí puedes:\n\n' +
                    '• **Gestionar tickets** - Crear, asignar y seguir tickets\n' +
                    '• **Generar reportes** - Análisis y estadísticas del sistema\n' +
                    '• **Administrar técnicos** - Gestionar el equipo técnico\n' +
                    '• **Configurar el sistema** - Ajustes y preferencias\n\n' +
                    '¿En qué más te puedo ayudar?'
                );
                break;
                
            case 'help_tickets':
                this.addAssistantMessage(
                    '🎫 **Cómo Gestionar Tickets**\n\n' +
                    '**Para crear un ticket:**\n' +
                    '1. Ve a "Gestión de Tickets"\n' +
                    '2. Haz clic en "Nuevo Ticket"\n' +
                    '3. Completa la información requerida\n' +
                    '4. Asigna a un técnico\n\n' +
                    '**Para seguir un ticket:**\n' +
                    '• Usa el número de ticket para consultar su estado\n' +
                    '• Revisa el historial de cambios\n' +
                    '• Actualiza el progreso según sea necesario\n\n' +
                    '¿Necesitas ayuda con algún proceso específico?'
                );
                break;
                
            case 'help_reports':
                this.addAssistantMessage(
                    '📊 **Cómo Generar Reportes**\n\n' +
                    '**Reportes disponibles:**\n' +
                    '• **Eficiencia de técnicos** - Rendimiento individual y general\n' +
                    '• **Estadísticas de tickets** - Distribución por estado\n' +
                    '• **Análisis de clientes** - Satisfacción y actividad\n' +
                    '• **Estado del sistema** - Salud y rendimiento\n\n' +
                    '**Para generar un reporte:**\n' +
                    '1. Ve a la sección "Reportes"\n' +
                    '2. Selecciona el tipo de reporte\n' +
                    '3. Configura los filtros\n' +
                    '4. Genera y descarga el reporte\n\n' +
                    '¿Te gustaría que te ayude con algún reporte específico?'
                );
                break;
                
            case 'help_technical':
                this.addAssistantMessage(
                    '🔧 **Soporte Técnico**\n\n' +
                    '**Problemas comunes y soluciones:**\n\n' +
                    '**Error de conexión:**\n' +
                    '• Verifica tu conexión a internet\n' +
                    '• Recarga la página (F5)\n' +
                    '• Limpia la caché del navegador\n\n' +
                    '**Problemas de rendimiento:**\n' +
                    '• Cierra pestañas innecesarias\n' +
                    '• Verifica que tu navegador esté actualizado\n' +
                    '• Contacta al administrador del sistema\n\n' +
                    '**¿Necesitas más ayuda?**\n' +
                    'Contacta al equipo de soporte técnico para asistencia especializada.'
                );
                break;
                
            case 'help_tutorial':
                this.addAssistantMessage(
                    '🎓 ¡Perfecto! Te voy a mostrar un tutorial interactivo sobre cómo gestionar tickets en el sistema.',
                    {
                        type: 'custom',
                        html: `
                            <div style="margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef;">
                                <h5 style="text-align: center; color: #333; margin-bottom: 20px; font-weight: bold;">
                                    <i class="fas fa-graduation-cap me-2"></i>Tutorial de Gestión de Tickets
                                </h5>
                                <p style="color: #666; margin-bottom: 20px; text-align: center;">
                                    Selecciona el módulo del cual quieres ver el tutorial paso a paso para aprender a gestionar tickets eficientemente.
                                </p>
                                <div style="text-align: center;">
                                    <button onclick="window.virtualAssistant.showModuleTutorialSelection()" 
                                            style="padding: 12px 24px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;"
                                            onmouseover="this.style.backgroundColor='#0056b3'" 
                                            onmouseout="this.style.backgroundColor='#007bff'">
                                        <i class="fas fa-list me-2"></i>Ver Módulos Disponibles
                                    </button>
                                </div>
                            </div>
                        `
                    }
                );
                break;
                
            default:
                this.addAssistantMessage('Lo siento, no pude procesar esa consulta de ayuda. ¿Podrías intentar con otra opción?');
        }
    }

    // Función para mostrar selección de módulos para tutorial
    showModuleTutorialSelection() {
        // Obtener módulos del usuario usando la misma API que el navbar
        this.getUserModules().then(modules => {
            this.createModuleSelectionModal(modules);
        }).catch(error => {
            console.error('Error obteniendo módulos:', error);
            this.addAssistantMessage('❌ Error al obtener los módulos disponibles. Intenta de nuevo.');
        });
    }

    // Obtener módulos del usuario
    async getUserModules() {
        try {
            const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/getModulesUsers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=getModulesUsers&id_usuario=${id_usuario}`
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('📋 Datos recibidos del API:', data);
            
            if (data.success && Array.isArray(data.modules)) {
                // Filtrar solo módulos activos y con permisos
                return data.modules.filter(module => module.activo === "t");
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (error) {
            console.error('Error en getUserModules:', error);
            throw error;
        }
    }

    // Crear modal de selección de módulos
    createModuleSelectionModal(modules) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'module-tutorial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;

        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'module-tutorial-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;

        // Crear contenido del modal
        modal.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">📚 Selecciona un Módulo</h2>
                <p style="margin: 0; color: #666; font-size: 14px;">Elige el módulo del cual quieres ver el tutorial</p>
            </div>

            <!-- DASHBOARD (TICKETS) -->
                <div class="module-card" data-module="dashboard" style="
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #f8f9fa;
                " onmouseover="this.style.borderColor='#007bff'; this.style.background='#d4edda'" 
                onmouseout="this.style.borderColor='#e9ecef'; this.style.background='#f8f9fa'">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="
                            width: 50px;
                            height: 50px;
                            background: #007bff;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 20px;
                            font-weight: bold;
                        ">
                           📊
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Dashboard</h4>
                            <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">Resumen general y gestión de tickets</p>
                        </div>
                        <div style="color: #007bff; font-size: 18px;">→</div>
                    </div>
                </div>
            </div>
            
            <div id="modules-list" style="display: grid; gap: 15px;">
                ${modules.map(module => `
                    <div class="module-card" data-module-id="${module.idmodulo}" style="
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        background: #f8f9fa;
                    ">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="
                                width: 50px;
                                height: 50px;
                                background: #007bff;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 20px;
                                font-weight: bold;
                            ">
                                ${this.getModuleIcon(module.desc_modulo)}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${module.desc_modulo}</h4>
                                <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">Código: ${module.codmod} - Módulo del sistema</p>
                            </div>
                            <div style="color: #007bff; font-size: 18px;">→</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <button id="close-module-modal" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancelar</button>
            </div>
        `;

        // Agregar estilos CSS
        if (!document.getElementById('module-tutorial-styles')) {
            const style = document.createElement('style');
            style.id = 'module-tutorial-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .module-card:hover {
                    border-color: #007bff !important;
                    background: #e3f2fd !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
                }
            `;
            document.head.appendChild(style);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Agregar event listeners
        this.addModuleSelectionListeners();
    }

    // Obtener icono para cada módulo
    getModuleIcon(moduleName) {
        const icons = {
            'Gestión Coordinador': '👨‍💼',
            'Gestión Técnicos': '🔧',
            'Gestión Taller': '🏭',
            'Gestión Rosal': '📦',
            'Gestión Regiones': '🗺️',
            'Consultas y Reportes': '📋',
            'Administración': '⚙️',
            'Configuración': '🔧',
            'Centro de Solicitudes': '📝'
        };
        return icons[moduleName] || '📋';
    }


    // Agregar event listeners al modal
    addModuleSelectionListeners() {
        const self = this; // ← GUARDAR referencia

        document.querySelectorAll('.module-card[data-module-id]').forEach(card => {
            card.addEventListener('click', () => {
                const moduleId = card.getAttribute('data-module-id');
                const moduleName = card.querySelector('h4').textContent;
                self.closeModuleSelectionModal();
                self.showSubmodulesForModule(moduleId, moduleName); // ← MUESTRA SUBMÓDULOS
            });
        });

        // DASHBOARD
        const dashboardCard = document.querySelector('.module-card[data-module="dashboard"]');
        if (dashboardCard) {
            dashboardCard.addEventListener('click', () => {
                self.closeModuleSelectionModal(); // ← Usa self
                self.startTicketTutorial();
            });
        }

        // Cancelar
        const closeBtn = document.getElementById('close-module-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => self.closeModuleSelectionModal());
        }
    }

    // Cerrar modal
    closeModuleModal() {
        const overlay = document.getElementById('module-tutorial-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    closeModuleSelectionModal() {
        const overlay = document.getElementById('module-tutorial-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Limpiar estilos si existen
        const styles = document.getElementById('module-tutorial-styles');
        if (styles) {
            styles.remove();
        }
    }

    // Mostrar submódulos para un módulo específico
    async showSubmodulesForModule(moduleId, moduleName) {
        try {
            // Cerrar modal actual
            this.closeModuleModal();
            
            // Mostrar loading
            this.showLoadingMessage('Cargando submódulos...');
            
            // Obtener submódulos
            const submodules = await this.getSubmodulesForModule(moduleId);
            
            // Crear modal de submódulos
            this.createSubmodulesModal(moduleName, submodules);
            
        } catch (error) {
            console.error('Error obteniendo submódulos:', error);
            this.addAssistantMessage('❌ Error al obtener los submódulos disponibles. Intenta de nuevo.');
        }
    }

    // Obtener submódulos de un módulo específico
    async getSubmodulesForModule(moduleId) {
        try {
            const response = await fetch(`${ENDPOINT_BASE}${APP_PATH}api/consulta/getSubmodulesForModule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=getSubmodulesForModule&moduleId=${moduleId}&id_usuario=${id_usuario}`
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('📋 Submódulos recibidos:', data);
            console.log('📋 Estructura del primer submódulo:', data.submodules && data.submodules[0]);
            
            if (data.success && Array.isArray(data.submodules)) {
                return data.submodules;
            } else {
                throw new Error('Formato de respuesta inválido para submódulos');
            }
        } catch (error) {
            console.error('Error en getSubmodulesForModule:', error);
            throw error;
        }
    }

    // Crear modal de submódulos
    createSubmodulesModal(moduleName, submodules) {
        console.log('📋 Creando modal para submódulos:', submodules);
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'submodules-tutorial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;

        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'submodules-tutorial-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;

        // Crear contenido del modal
        modal.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">📚 Submódulos de ${moduleName}</h2>
                <p style="margin: 0; color: #666; font-size: 14px;">Elige el submódulo del cual quieres ver el tutorial</p>
            </div>
            
            <div id="submodules-list" style="display: grid; gap: 15px;">
                ${submodules.map(submodule => `
                    <div class="submodule-card" data-url-archivo="${submodule.url_archivo}" style="
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        background: #f8f9fa;
                    ">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="
                                width: 50px;
                                height: 50px;
                                background: #28a745;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 20px;
                                font-weight: bold;
                            ">
                                ${this.getSubmoduleIcon(submodule.desc_submodulo)}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${submodule.desc_submodulo}</h4>
                                <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">${submodule.description || 'Submódulo del sistema'}
                                ${!submodule.url_archivo ? '<br><small style="color: #dc3545;">Tutorial no disponible</small>' : ''}</p>
                            </div>
                            <div style="color: #28a745; font-size: 18px;">→</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <button id="back-to-modules" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-right: 10px;
                ">← Volver a Módulos</button>
                <button id="close-submodules-modal" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancelar</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Agregar event listeners
        this.addSubmodulesListeners();
    }

    // Obtener icono para submódulos
    getSubmoduleIcon(submoduleName) {
        const icons = {
            'Gestión Coordinador': '👨‍💼',
            'Gestión Técnico': '🔧',
            'Gestión Taller': '🏭',
            'Gestión Rosal': '📦',
            'Gestión Regiones': '🗺️',
            'Consulta Rif': '🔍',
            'Reporte Ticket': '📈',
            'Usuarios': '👥',
            'Configuración': '⚙️',
            'Periférico POS': '💻',
            'Verificación de Solvencia': '📑',
            'Gestión Comercial': '🤝',
            'Documentos': '📝'
            
        };
        return icons[submoduleName] || '📋';
    }

    // Agregar event listeners para submódulos
    addSubmodulesListeners() {
        // Cerrar modal
        const closeBtn = document.getElementById('close-submodules-modal');
        const backBtn = document.getElementById('back-to-modules');
        const overlay = document.getElementById('submodules-tutorial-overlay');
        
        closeBtn.onclick = () => this.closeSubmodulesModal();
        backBtn.onclick = () => {
            this.closeSubmodulesModal();
            this.showModuleTutorialSelection();
        };
        
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeSubmodulesModal();
            }
        };

        // En addSubmodulesListeners()
        const submoduleCards = document.querySelectorAll('.submodule-card');
        console.log(`📋 Encontrados ${submoduleCards.length} cards de submódulos`);
        
        submoduleCards.forEach((card, index) => {
                const urlArchivo = card.dataset.urlArchivo?.trim();
            console.log(`📝 Card ${index + 1}: urlArchivo="${urlArchivo}"`);
            
            card.onclick = () => {
                console.log(`🖱️ Click en card ${index + 1} con urlArchivo="${urlArchivo}"`);
                
                if (!urlArchivo) {
                    console.warn('⚠️ Este submódulo no tiene tutorial disponible (urlArchivo vacío)');
                    return;
                }

                // Construir URL completa una sola vez
                const fullUrl = this.buildSubmoduleUrl(urlArchivo);

                // Pasar directamente a startSubmoduleTutorial
                this.startSubmoduleTutorial(fullUrl);
            };
        });
    }

   buildSubmoduleUrl(urlArchivo) {
        // Asegúrate de que urlArchivo sea algo como: "consulta_rif" o "reporte_ticket"
        const cleanPath = urlArchivo.trim().replace(/^\/+/, ''); // Quita slashes iniciales
        const fullUrl = `${window.location.origin}/SoportePost/${cleanPath}`;
        console.log(`🔗 buildSubmoduleUrl: urlArchivo="${urlArchivo}" → fullUrl="${fullUrl}"`);
        return fullUrl;
    }

    // Cerrar modal de submódulos
    closeSubmodulesModal() {
        const overlay = document.getElementById('submodules-tutorial-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Mapeo de archivo → tipo de tutorial
    getTutorialParam(urlArchivo) {
        const map = {
            'consulta_rif': 'rif',
            'gestion_tickets': 'tickets',
            'reporte_ticket': 'reportes',
            'asignar_tecnico': 'gestion_coordinacion',
            'tecnico': 'tecnicos',
            'taller': 'taller',
            'pendiente_entrega': 'rosal',
            'region': 'region',
            'periférico_pos': 'periferico',
            'periferico_pos': 'periferico', // Versión sin acento
            'domiciliacion': 'domiciliacion',
        };

        // Decodificar URL para manejar caracteres codificados (ej: perif%C3%A9rico_pos)
        let clean = decodeURIComponent(urlArchivo.trim())
            .replace(/^\//, '')
            .split('?')[0]
            .split('.')[0]; // quita .php, .html, etc.

        // Normalizar: convertir a minúsculas y quitar espacios
        clean = clean.toLowerCase().trim();

        console.log(`🔍 getTutorialParam: urlArchivo="${urlArchivo}" → clean="${clean}"`);

        return map[clean] || null;
    }

  // Iniciar tutorial de submódulo específico
    startSubmoduleTutorial(fullUrl) {
        console.log(`🚀 startSubmoduleTutorial llamado con fullUrl: "${fullUrl}"`);
        this.closeSubmodulesModal();
        this.showRedirectMessage();

        setTimeout(() => {
            try {
            const tutorialUrl = new URL(fullUrl);
                const pathnameParts = tutorialUrl.pathname.split('/').filter(p => p);
                const urlArchivo = pathnameParts[pathnameParts.length - 1] || pathnameParts[pathnameParts.length - 2] || '';
                
                console.log(`📂 URL extraída: pathname="${tutorialUrl.pathname}", urlArchivo="${urlArchivo}"`);
                
            const tutorialType = this.getTutorialParam(urlArchivo);

            if (tutorialType) {
                tutorialUrl.searchParams.set('tutorial', tutorialType);
                    console.log(`✅ Redirigiendo con tutorial: ${tutorialType}`);
                    console.log(`🔗 URL final: ${tutorialUrl.toString()}`);
            } else {
                    console.warn(`⚠️ Submódulo sin tutorial: ${urlArchivo} → redirigiendo sin parámetro`);
                // NO agrega 'tutorial=active'
            }

            window.location.href = tutorialUrl.toString();
            } catch (error) {
                console.error(`❌ Error en startSubmoduleTutorial:`, error);
                console.error(`   fullUrl: "${fullUrl}"`);
                // Fallback: redirigir sin parámetro de tutorial
                window.location.href = fullUrl;
            }
        }, 1500);
    }

    // Mostrar mensaje de loading
    showLoadingMessage(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #007bff;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        loadingDiv.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(loadingDiv);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            loadingDiv.remove();
        }, 2000);
    }

    // Iniciar tutorial de módulo específico
    startModuleTutorial(moduleId, moduleHref) {
        // Cerrar modal
        this.closeModuleModal();

        // Mostrar mensaje de redirección
        this.showRedirectMessage(moduleHref);
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = `${window.location.origin}${window.location.pathname}?module=${moduleHref}`;
        }, 1500);
    }

    // Mostrar mensaje de redirección
    showRedirectMessage(moduleHref) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #007bff;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 10001;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        message.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
                <div>Redirigiendo al módulo...</div>
                <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">El tutorial comenzará automáticamente</div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que se cargue el sidenav
    setTimeout(() => {
        window.virtualAssistant = new VirtualAssistant();
        console.log('🤖 Asistente Virtual Ana inicializado');
    }, 1000);
});

const additionalStyles = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-15px); }
        60% { transform: translateY(-7px); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Estilos para categorías desplegables */
    .category-section {
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
    }
    
    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        background-color: #ffffff;
        border-bottom: 1px solid #e9ecef;
        transition: all 0.3s ease;
        user-select: none;
    }
    
    .category-header:hover {
        background-color: #f8f9fa;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .category-header.active {
        background-color: #e3f2fd;
        border-bottom-color: #2196f3;
    }
    
    .category-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .category-icon {
        font-size: 18px;
        width: 24px;
        text-align: center;
    }
    
    .category-name {
        font-weight: 600;
        font-size: 14px;
        color: #333;
    }
    
    .category-arrow {
        transition: transform 0.3s ease;
        color: #666;
    }
    
    .category-arrow svg {
        transition: transform 0.3s ease;
    }
    
    .category-options {
        background-color: #ffffff;
        border-top: 1px solid #e9ecef;
        padding: 8px 0;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .category-options .chat-option-btn {
        width: 100%;
        margin: 2px 8px;
        padding: 10px 12px;
        border: none;
        background-color: transparent;
        text-align: left;
        border-radius: 6px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #555;
    }
    
    .category-options .chat-option-btn:hover {
        background-color: #2196f3;
        color: #ffffff;
        transform: translateX(4px);
    }
    
    .category-options .chat-option-btn:active {
        transform: translateX(2px);
    }
    
    .category-options .option-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
    
    .category-options .option-text {
        flex: 1;
        font-weight: 500;
    }
    
    /* Animación de entrada para las opciones */
    .category-options {
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
        }
        to {
            opacity: 1;
            transform: translateY(0);
            max-height: 300px;
        }
    }
    
    /* Scroll personalizado para las opciones */
    .category-options::-webkit-scrollbar {
        width: 4px;
    }
    
    .category-options::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
    }
    
    .category-options::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 2px;
    }
    
    .category-options::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

// Crear y agregar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// === DETECCIÓN Y EJECUCIÓN AUTOMÁTICA DEL TUTORIAL ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOMContentLoaded: Buscando parámetro de tutorial...');
    const urlParams = new URLSearchParams(window.location.search);
    let tutorialParam = urlParams.get('tutorial');

    console.log(`🔍 Parámetro 'tutorial' directo: "${tutorialParam}"`);

    // Soporte para ?tutorial-rif o ?tutorial=rif
    if (!tutorialParam) {
        const match = window.location.search.match(/[?&]tutorial[-=]([a-z]+)/i);
        if (match) {
            tutorialParam = match[1].toLowerCase();
            console.log(`🔍 Parámetro 'tutorial' encontrado en regex: "${tutorialParam}"`);
        }
    }

    if (!tutorialParam) {
        console.log('ℹ️ No se encontró parámetro de tutorial en la URL');
        return;
    }

    // Mapeo de tipos de tutorial
    const tutorialMap = {
        'rif': 'startRifTutorial',
        'tickets': 'startTicketTutorial',
        'gestion_coordinacion': 'startGestionCoordinacionTutorial',
        'tecnicos': 'startTechnicianTutorial',
        'taller': 'startLabTutorial',
        'lab': 'startLabTutorial',
        'rosal': 'startRosalTutorial',
        'region': 'startRegionTutorial',
        'periferico': 'startComponentesTutorial',
        'domiciliacion': 'startDomiciliacionTutorial'
    };

    const methodName = tutorialMap[tutorialParam];
    if (!methodName) {
        console.warn(`⚠️ Tipo de tutorial no reconocido: "${tutorialParam}"`);
        console.warn(`   Tipos disponibles: ${Object.keys(tutorialMap).join(', ')}`);
        return;
    }

    console.log(`✅ Tutorial activado desde URL: ?tutorial=${tutorialParam} → método: ${methodName}()`);

    // Limpiar URL
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);

    // Esperar a que el asistente esté listo
    let attempts = 0;
    const maxAttempts = 50; // 10 segundos (200ms * 50)
    const waitForAssistant = setInterval(() => {
        attempts++;
        if (window.virtualAssistant && typeof window.virtualAssistant[methodName] === 'function') {
            clearInterval(waitForAssistant);
            console.log(`🎬 Ejecutando tutorial: ${methodName}()`);
            window.virtualAssistant[methodName]();
        } else if (attempts >= maxAttempts) {
            clearInterval(waitForAssistant);
            console.error(`❌ Timeout: Método de tutorial no encontrado después de ${maxAttempts} intentos`);
            console.error(`   window.virtualAssistant existe: ${!!window.virtualAssistant}`);
            console.error(`   método ${methodName} existe: ${window.virtualAssistant && typeof window.virtualAssistant[methodName] === 'function'}`);
        } else if (attempts % 10 === 0) {
            console.log(`⏳ Esperando asistente... (intento ${attempts}/${maxAttempts})`);
        }
    }, 200);

    // Timeout de seguridad (10 segundos)
    setTimeout(() => {
        clearInterval(waitForAssistant);
        if (window.virtualAssistant && typeof window.virtualAssistant[methodName] !== 'function') {
            console.error(`❌ Método de tutorial no encontrado después de espera: ${methodName}`);
        }
    }, 10000);
});