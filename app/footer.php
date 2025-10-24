<script>
    var expired_sessions = <?php echo json_encode($this->expired_sessions ?? false); ?>;
    var message = <?php echo json_encode($this->message ?? ''); ?>;
    var redirect = <?php echo json_encode($this->redirect ?? 'login'); ?>;
    var usuario_id = <?php echo json_encode($this->usuario_id ?? null); ?>;
    var sessionLifetime = <?php echo json_encode($this->sessionLifetime ?? 0); ?>;

    // Verificar si hay sesiones expiradas (basado en la respuesta del backend)
    if (expired_sessions) {
        // Crear elementos interactivos simplificados
        const progressBar = `<div class="session-progress-bar"></div>`;
        
        // Elementos interactivos básicos
        const interactiveElements = `
            <div class="session-countdown" style="position: absolute; top: 10px; right: 15px; color: rgba(255,255,255,0.8); font-size: 0.9rem; font-weight: 600; z-index: 5;">
                <span id="countdown-timer">30</span>s
            </div>
            <div class="session-status-indicator" style="position: absolute; top: 10px; left: 15px; z-index: 5;">
                <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; animation: statusBlink 2s infinite;"></div>
            </div>
        `;
        
        Swal.fire({
            title: '¿Deseas extender la sesión?',
            text: 'Tu sesión está a punto de expirar. ¿Quieres continuar trabajando?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e3a8a',
            cancelButtonColor: '#ef4444',
            confirmButtonText: `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    Extender Sesión
                </span>
            `,
            cancelButtonText: `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6 12.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1H7.707l3.147-3.146a.5.5 0 0 0-.708-.708L7 11.293V8.5a.5.5 0 0 0-1 0v4z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                    Cerrar Sesión
                </span>
            `,
            customClass: {
                popup: 'modern-swal-popup',
                title: 'modern-swal-title',
                content: 'modern-swal-content',
                confirmButton: 'modern-swal-confirm',
                cancelButton: 'modern-swal-cancel'
            },
            backdrop: 'rgba(0, 0, 0, 0.8)',
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
                // Agregar elementos interactivos después de que se abra el modal
                const popup = document.querySelector('.modern-swal-popup');
                if (popup) {
                    popup.insertAdjacentHTML('beforeend', progressBar);
                    popup.insertAdjacentHTML('beforeend', interactiveElements);
                    
                    // Agregar efectos de sonido mejorados
                    if (typeof Audio !== 'undefined') {
                        try {
                            // Sonido de notificación más elaborado
                            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU6k9n1unEiBS13yO/eizEIHWq+8+OWT');
                            audio.volume = 0.15;
                            audio.play().catch(() => {});
                            
                            // Sonido adicional después de 1 segundo
                            setTimeout(() => {
                                const audio2 = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU6k9n1unEiBS13yO/eizEIHWq+8+OWT');
                                audio2.volume = 0.1;
                                audio2.play().catch(() => {});
                            }, 1000);
                        } catch (e) {
                            // Ignorar errores de audio
                        }
                    }
                    
                    // Efecto de vibración mejorado en dispositivos móviles
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200, 100, 200]);
                    }
                    
                    // Agregar efecto de brillo dinámico al modal
                    popup.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px rgba(251, 191, 36, 0.1)';
                    
                    // Animación de entrada moderna
                    popup.style.animation = 'modernModalEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    
                    // Agregar efecto de parpadeo al modal
                    setTimeout(() => {
                        popup.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 60px rgba(251, 191, 36, 0.2)';
                    }, 500);
                }
                
                // Contador regresivo interactivo
                let countdown = 30;
                const countdownElement = document.getElementById('countdown-timer');
                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdownElement) {
                        countdownElement.textContent = countdown;
                        
                        // Cambiar color cuando queda poco tiempo
                        if (countdown <= 10) {
                            countdownElement.style.color = '#ef4444';
                            countdownElement.style.fontWeight = '700';
                            countdownElement.style.animation = 'countdownPulse 0.5s infinite';
                        } else if (countdown <= 20) {
                            countdownElement.style.color = '#f59e0b';
                        }
                    }
                    
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        // Cerrar el modal
                        Swal.close();
                        
                        // Hacer logout automático cuando el contador llegue a 0
                        var xhrLogout = new XMLHttpRequest();
                        xhrLogout.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/logout`);
                        xhrLogout.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhrLogout.onload = function() {
                            // Redirigir al login después del logout
                            window.location.href = redirect;
                        };
                        xhrLogout.onerror = function() {
                            // Si hay error en el logout, redirigir de todas formas
                            window.location.href = redirect;
                        };
                        xhrLogout.send('logout=1');
                    }
                }, 1000);
                
                // Agregar efectos de hover súper mejorados a los botones
                const confirmBtn = document.querySelector('.modern-swal-confirm');
                const cancelBtn = document.querySelector('.modern-swal-cancel');
                
                if (confirmBtn) {
                    confirmBtn.addEventListener('mouseenter', () => {
                        confirmBtn.style.transform = 'translateY(-3px) scale(1.05)';
                        confirmBtn.style.boxShadow = '0 15px 35px rgba(30, 58, 138, 0.4)';
                    });
                    
                    confirmBtn.addEventListener('mouseleave', () => {
                        confirmBtn.style.transform = 'translateY(0) scale(1)';
                        confirmBtn.style.boxShadow = '0 8px 25px rgba(30, 58, 138, 0.3)';
                    });
                }
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('mouseenter', () => {
                        cancelBtn.style.transform = 'translateY(-3px) scale(1.05)';
                        cancelBtn.style.boxShadow = '0 15px 35px rgba(107, 114, 128, 0.4)';
                    });
                    
                    cancelBtn.addEventListener('mouseleave', () => {
                        cancelBtn.style.transform = 'translateY(0) scale(1)';
                        cancelBtn.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.3)';
                    });
                }
                
                
            },
            preConfirm: () => {
                // Efecto visual al confirmar
                const confirmBtn = document.querySelector('.modern-swal-confirm');
                if (confirmBtn) {
                    confirmBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                    confirmBtn.innerHTML = `
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                            Extendiendo...
                        </span>
                    `;
                }
                return true;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // El usuario quiere extender la sesión
                var xhr = new XMLHttpRequest();
                xhr.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/extendSession`);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = function () {
                    try {
                        var resp = JSON.parse(xhr.responseText || '{}');
                        if (xhr.status >= 200 && xhr.status < 300 && resp.success) {
                            // Mostrar confirmación de éxito
                            Swal.fire({
                                title: '¡Sesión Extendida!',
                                text: 'Tu sesión ha sido extendida exitosamente.',
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false,
                                customClass: {
                                    popup: 'success-swal-popup',
                                    title: 'success-swal-title',
                                    content: 'success-swal-content'
                                },
                                backdrop: 'rgba(0, 0, 0, 0.8)',
                                showClass: {
                                    popup: 'animate__animated animate__bounceIn animate__faster'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__bounceOut animate__faster'
                                },
                                didOpen: () => {
                                    const popup = document.querySelector('.success-swal-popup');
                                    if (popup) {
                                        popup.style.background = 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)';
                                        popup.style.border = '2px solid rgba(16, 185, 129, 0.3)';
                                        popup.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px rgba(16, 185, 129, 0.2)';
                                        
                                        // Agregar efectos de celebración con adornos deslizantes
                                        const celebrationElements = `
                                            <div class="celebration-particles">
                                                <div class="celebration-particle">🎉</div>
                                                <div class="celebration-particle">✨</div>
                                                <div class="celebration-particle">🎊</div>
                                                <div class="celebration-particle">🌟</div>
                                                <div class="celebration-particle">💫</div>
                                                <div class="celebration-particle">🎈</div>
                                                <div class="celebration-particle">🎁</div>
                                                <div class="celebration-particle">🏆</div>
                                            </div>
                                        `;
                                        popup.insertAdjacentHTML('beforeend', celebrationElements);
                                    }
                                    
                                    // Sonido de éxito
                                    if (typeof Audio !== 'undefined') {
                                        try {
                                            const successAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU6k9n1unEiBS13yO/eizEIHWq+8+OWT');
                                            successAudio.volume = 0.2;
                                            successAudio.play().catch(() => {});
                                        } catch (e) {}
                                    }
                                    
                                    // Vibración de éxito
                                    if (navigator.vibrate) {
                                        navigator.vibrate([100, 50, 100, 50, 200]);
                                    }
                                }
                            }).then(() => {
                            // Si la extensión fue exitosa, recargar la página para aplicar los cambios
                            location.reload(true);
                            });
                        } else {
                            // Si hubo un error al extender, forzar el logout
                            Swal.fire({
                                icon: 'error',
                                title: 'No se pudo extender',
                                text: (resp && resp.message) || 'Intente nuevamente.',
                                customClass: {
                                    popup: 'modern-swal-popup',
                                    title: 'modern-swal-title',
                                    content: 'modern-swal-content'
                                }
                            });
                            setTimeout(() => { window.location.href = redirect; }, 2000);
                        }
                    } catch (e) {
                        Swal.fire({ 
                            icon: 'error', 
                            title: 'Error', 
                            text: 'Respuesta inválida del servidor.',
                            customClass: {
                                popup: 'modern-swal-popup',
                                title: 'modern-swal-title',
                                content: 'modern-swal-content'
                            }
                        });
                        setTimeout(() => { window.location.href = redirect; }, 2000);
                    }
                };
                xhr.onerror = function() {
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Error de red', 
                        text: 'No se pudo contactar al servidor.',
                        customClass: {
                            popup: 'modern-swal-popup',
                            title: 'modern-swal-title',
                            content: 'modern-swal-content'
                        }
                    });
                    setTimeout(() => { window.location.href = redirect; }, 2000);
                };
                xhr.send('extend=1');
            } else {
               // El usuario hizo clic en "No, cerrar sesión"
                var xhrLogout = new XMLHttpRequest();
                xhrLogout.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/logout`);
                xhrLogout.onload = function() {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Cerrando Sesión...',
                        text: 'Serás redirigido al login en unos momentos.',
                        color: '#1e3a8a',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        customClass: {
                            popup: 'modern-swal-popup',
                            title: 'modern-swal-title',
                            content: 'modern-swal-content',
                            timerProgressBar: 'modern-swal-progress-bar'
                        },
                        backdrop: 'rgba(0, 0, 0, 0.8)',
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown animate__faster'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp animate__faster'
                        },
                        didOpen: () => {
                            const popup = document.querySelector('.modern-swal-popup');
                            if (popup) {
                                popup.style.background = 'linear-gradient(145deg, #ffffff 0%, #fef2f2 100%)';
                                popup.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                            }
                        },
                        willClose: () => {
                            window.location.href = redirect;
                        }
                    });
                };
                xhrLogout.onerror = function() {
                    // En caso de error en la solicitud de logout, redirige de todas formas
                    window.location.href = redirect;
                };
                xhrLogout.send('logout=1');
            }
        });
    }

    // Agregar lógica de recarga automática
    if (sessionLifetime && !expired_sessions) { // Solo si la sesión no está expirada
        window.__sessionReloadTimer = setTimeout(function() {
            location.reload(true);
        }, sessionLifetime * 1000);
    }
</script>