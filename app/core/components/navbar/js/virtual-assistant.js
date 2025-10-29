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



// Sistema de Tutorial/Onboarding para Gestión de Tickets
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
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + (rect.height / 2);
        const viewportCenter = viewportHeight / 2;
        
        // Si el elemento no está centrado, hacer scroll para centrarlo
        if (Math.abs(elementCenter - viewportCenter) > 100) {
            const scrollToPosition = Math.max(0, window.pageYOffset + elementCenter - viewportCenter);
            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });
            
            // Esperar un poco para que termine el scroll antes de continuar
            return new Promise(resolve => {
                setTimeout(resolve, 800);
            });
        }
        
        return Promise.resolve();
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
{
    selector: '#RazonInput',
    title: 'Campo de Búsqueda',
    description: 'Aquí ingresas el RIF completo (con guión). Ejemplo: <strong>V-12345678</strong>',
    position: 'bottom',

    waitFor: () => {
        const input = document.getElementById('RazonInput');
        if (!input) return false;

        const style = window.getComputedStyle(input);
        return input.offsetParent !== null &&
               style.display !== 'none' &&
               style.visibility !== 'hidden';
    },

    onShow: () => {
        setTimeout(() => {
            const input = document.getElementById('RazonInput');
            if (input) {
                input.focus();
                input.value = 'V-12345678'; // Ejemplo realista
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, 500);
    }
},

// PASO: Resaltar el BOTÓN "BUSCAR"
{
    selector: '#buscarRazon',
    title: 'Botón Buscar',
    description: 'Presiona este botón para iniciar la búsqueda del cliente.',
    position: 'right',

    waitFor: () => {
        const btn = document.getElementById('buscarRazon');
        if (!btn) return false;

        const input = document.getElementById('RazonInput');
        const hasValue = input && input.value.trim().length > 0;

        return btn.offsetParent !== null && !btn.disabled && hasValue;
    },

    // OPCIONAL: Clic automático al avanzar
    onNext: () => new Promise(resolve => {
        const btn = document.getElementById('buscarRazon');
        if (!btn || btn.disabled) return resolve();

        const tutorial = window.virtualAssistant?.rifTutorial;
        const overlay = tutorial?.overlay;

        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.transition = 'opacity 0.2s ease-out';
        }

        setTimeout(() => {
            btn.click();
            console.log('Búsqueda iniciada: V-12345678');

            setTimeout(() => {
                if (overlay) {
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'auto';
                    overlay.style.transition = 'opacity 0.3s ease-in';
                }
                setTimeout(resolve, 600);
            }, 1000); // Espera a que cargue el resultado
        }, 300);
    })
},
            {
                selector: '#rifCountTable',
                title: 'Resultados de Búsqueda',
                description: 'Aquí aparecerán todos los POS asociados al cliente. Haz clic en el <strong>Serial POS</strong> para ver detalles.',
                position: 'top',
                waitFor: () => document.querySelector('#rifCountTable tbody tr td')?.textContent !== 'No hay datos'
            },
            {
                selector: '.serial-pos-column',
                title: 'Serial del POS',
                description: 'Haz clic en cualquier serial para ver los detalles del equipo y crear un ticket.',
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
                position: 'top'
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
        const rect = element.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;

        if (Math.abs(centerY - viewportCenter) > 100) {
            window.scrollTo({
                top: window.pageYOffset + centerY - viewportCenter,
                behavior: 'smooth'
            });
            return new Promise(r => setTimeout(r, 800));
        }
        return Promise.resolve();
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
                        <h5 class="assistant-name">Ana - Chat IA</h5>
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
                                <p>¡Hola! Soy Ana, tu asistente virtual con IA. Puedo ayudarte con consultas inteligentes del sistema.</p>
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
        console.log('🤖 Iniciando tutorial de gestión de tickets');
        this.ticketTutorial.startTutorial();
    }

    startRifTutorial() {
        console.log('🤖 Iniciando tutorial de gestión de RIF');
        this.rifTutorial.startTutorial();
    }

    startReportsTutorial() {
        console.log('Iniciando tutorial: Reportes');
        // this.reportsTutorial.startT  utorial();
    }

    startTechnicianTutorial() {
        console.log('Iniciando tutorial: Gestión de Técnicos');
        // this.technicianTutorial.startTutorial();
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
            'Dashboard': '📊',
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
        // Cerrar modal
        const closeBtn = document.getElementById('close-module-modal');
        const overlay = document.getElementById('module-tutorial-overlay');
        
        closeBtn.onclick = () => this.closeModuleModal();
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeModuleModal();
            }
        };

        // Seleccionar módulo
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.onclick = () => {
                const moduleId = card.dataset.moduleId;
                const moduleName = card.querySelector('h4').textContent;
                this.showSubmodulesForModule(moduleId, moduleName);
            };
        });
    }

    // Cerrar modal
    closeModuleModal() {
        const overlay = document.getElementById('module-tutorial-overlay');
        if (overlay) {
            overlay.remove();
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
            'Dashboard': '📊',
            'Asignar Técnico': '👨‍💼',
            'Gestión Técnico': '🔧',
            'Gestión Taller': '🏭',
            'Gestión Rosal': '📦',
            'Gestión Regiones': '🗺️',
            'Consulta Rif': '🔍',
            'Reporte Ticket': '📈',
            'Usuarios': '👥',
            'Configuración': '⚙️'
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
        submoduleCards.forEach(card => {
            card.onclick = () => {
                const urlArchivo = card.dataset.urlArchivo?.trim();
                
                if (!urlArchivo) {
                    console.warn('Este submódulo no tiene tutorial disponible');
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
        return `${window.location.origin}/SoportePost/${cleanPath}`;
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
            'asignar_tecnico': 'tecnicos',
            'gestion_tecnico': 'tecnicos',
            'configuracion': 'config'
        };

        const clean = urlArchivo.trim()
            .replace(/^\//, '')
            .split('?')[0]
            .split('.')[0]; // quita .php, .html, etc.

        return map[clean] || null;
    }

    // Iniciar tutorial de submódulo específico
  // Iniciar tutorial de submódulo específico
    startSubmoduleTutorial(fullUrl) {
        this.closeSubmodulesModal();
        this.showRedirectMessage();

        setTimeout(() => {
            const tutorialUrl = new URL(fullUrl);
            const urlArchivo = tutorialUrl.pathname.split('/').pop().split('?')[0];
            const tutorialType = this.getTutorialParam(urlArchivo);

            if (tutorialType) {
                tutorialUrl.searchParams.set('tutorial', tutorialType);
                console.log(`Redirigiendo con tutorial: ${tutorialType}`);
            } else {
                console.log(`Submódulo sin tutorial: ${urlArchivo} → redirigiendo sin parámetro`);
                // NO agrega 'tutorial=active'
            }

            window.location.href = tutorialUrl.toString();
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

// Agregar estilos de animación adicionales
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
    const urlParams = new URLSearchParams(window.location.search);
    let tutorialParam = urlParams.get('tutorial');

    // Soporte para ?tutorial-rif o ?tutorial=rif
    if (!tutorialParam) {
        const match = window.location.search.match(/[?&]tutorial[-=]([a-z]+)/i);
        if (match) {
            tutorialParam = match[1].toLowerCase();
        }
    }

    if (!tutorialParam) return;

    // Mapeo de tipos de tutorial
    const tutorialMap = {
        'rif': 'startRifTutorial',
        'tickets': 'startTicketTutorial',
        'reportes': 'startReportsTutorial',
        'tecnicos': 'startTechnicianTutorial'
    };

    const methodName = tutorialMap[tutorialParam];
    if (!methodName) {
        console.warn(`Tipo de tutorial no reconocido: ${tutorialParam}`);
        return;
    }

    console.log(`Tutorial activado desde URL: ?tutorial=${tutorialParam}`);

    // Limpiar URL
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);

    // Esperar a que el asistente esté listo
    const waitForAssistant = setInterval(() => {
        if (window.virtualAssistant && typeof window.virtualAssistant[methodName] === 'function') {
            clearInterval(waitForAssistant);
            console.log(`Ejecutando tutorial: ${methodName}()`);
            window.virtualAssistant[methodName]();
        }
    }, 200);

    // Timeout de seguridad (10 segundos)
    setTimeout(() => {
        clearInterval(waitForAssistant);
        if (window.virtualAssistant && typeof window.virtualAssistant[methodName] !== 'function') {
            console.error(`Método de tutorial no encontrado después de espera: ${methodName}`);
        }
    }, 10000);
});