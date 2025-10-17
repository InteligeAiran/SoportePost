/**
 * Sistema de Asistente Virtual
 * Maneja la interacción con el asistente virtual femenino
 */

let text = null;

    // Agregar esta función al inicio de tu archivo virtual-assistant.js
        function formatNumber(number) {
            if (typeof number !== 'number') return number;
            return number.toFixed(2);
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
        
        // Cargar posición guardada o usar posición centrada por defecto
        if (this.loadPanelPosition()) {
            this.panel.style.left = `${this.panelPosition.x}px`;
            this.panel.style.top = `${this.panelPosition.y}px`;
            this.panel.style.transform = 'none';
        } else {
            // Posición centrada por defecto
            this.panel.style.left = '';
            this.panel.style.top = '';
            this.panel.style.transform = 'translate(-50%, -50%)';
        }
        
        // Log para debugging
        console.log('🤖 Panel del asistente virtual abierto');
    }
    
    closePanel() {
        this.isPanelOpen = false;
        this.panel.classList.remove('show');
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Log para debugging
        console.log('🤖 Panel del asistente virtual cerrado');
    }
    
    toggleCategory(categoryName) {
        // Cerrar todas las categorías abiertas
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
        
        // Si la categoría clickeada no estaba abierta, abrirla
        const targetOptions = document.getElementById(`${categoryName}-options`);
        const targetHeader = document.querySelector(`[data-category="${categoryName}"]`);
        
        if (targetOptions && targetHeader) {
            const isCurrentlyOpen = targetOptions.style.display !== 'none';
            
            if (!isCurrentlyOpen) {
                // Abrir la categoría
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
            } else {
                console.log(`🤖 Categoría "${categoryName}" cerrada`);
            }
        }
    }
    
    handleChatQuery(query, buttonElement) {
        console.log(`🤖 Consulta IA: ${query}`);
        
        // Obtener el texto del botón
        const queryText = buttonElement.querySelector('.option-text').textContent;
        
        // Deshabilitar botón temporalmente
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.6';
        
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
            messageContent += this.formatDataResponse(data);
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
            this.addAssistantMessage(
                '⏳ Tickets pendientes que requieren atención:',
                {
                    type: 'pending',
                    data: data
                }
            );
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
                
            case 'technician_efficiency':
                if (Array.isArray(data.data) && data.data.length > 0) {
                    formatted = `
                        <div class="data-response">
                            <div class="technician-efficiency-header">
                                <h6>🏆 <span style = "color:black;">Ranking de Eficiencia de Técnicos<span></h6>
                                <p style="font-size: 12px; color: #666; margin-bottom: 15px;">
                                    Análisis basado en tickets asignados, completados y tiempo de resolución (últimos 30 días)
                                </p>
                            </div>
                            <div class="technician-list">
                                ${data.data.map((tech, index) => {
                                    const rank = index + 1;
                                    const isTopThree = index < 3;
                                    const efficiencyColor = tech.efficiency_score >= 80 ? '#28a745' : tech.efficiency_score >= 60 ? '#ffc107' : '#dc3545';
                                    const borderColor = isTopThree ? '#28a745' : '#6c757d';
                                    
                                    return `
                                        <div class="technician-item" style="margin-bottom: 15px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid ${borderColor};">
                                            <div class="technician-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                <div class="technician-name">
                                                    <strong style="color: #333;">#${rank} ${tech.technician_name} ${tech.technician_surname}</strong>
                                                    ${isTopThree ? `<span style="margin-left: 8px; font-size: 12px; background-color: #28a745; color: white; padding: 2px 6px; border-radius: 3px;">TOP ${rank}</span>` : ''}
                                                </div>
                                                <div class="efficiency-score" style="font-size: 18px; font-weight: bold; color: ${efficiencyColor};">
                                                    ${tech.efficiency_score}%
                                                </div>
                                            </div>
                                            <div class="technician-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 12px;">
                                                <div class="stat-item">
                                                    <span class="stat-label">Tickets:</span>
                                                    <span class="stat-value">${tech.total_tickets_assigned}</span>
                                                </div>
                                                <div class="stat-item">
                                                    <span class="stat-label">Completados:</span>
                                                    <span class="stat-value" style="color: #28a745;">${tech.tickets_completed}</span>
                                                </div>
                                                <div class="stat-item">
                                                    <span class="stat-label">En Proceso:</span>
                                                    <span class="stat-value" style="color: #ffc107;">${tech.tickets_in_progress}</span>
                                                </div>
                                                <div class="stat-item">
                                                    <span class="stat-label">Abiertos:</span>
                                                    <span class="stat-value" style="color: #dc3545;">${tech.tickets_open}</span>
                                                </div>
                                                <div class="stat-item">
                                                    <span class="stat-label">Tasa:</span>
                                                    <span class="stat-value">${tech.completion_rate}%</span>
                                                </div>
                                                <div class="stat-item">
                                                    <span class="stat-label">Tiempo Prom:</span>
                                                    <span class="stat-value">${tech.average_resolution_time || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                } else {
                    formatted = `
                        <div class="data-response">
                            <div class="no-data">
                                <p>No hay datos de eficiencia de técnicos disponibles.</p>
                            </div>
                        </div>
                    `;
                }
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
