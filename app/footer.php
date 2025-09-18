<script>
    var expired_sessions = <?php echo json_encode($this->expired_sessions ?? false); ?>;
    var message = <?php echo json_encode($this->message ?? ''); ?>;
    var redirect = <?php echo json_encode($this->redirect ?? 'login'); ?>;
    var usuario_id = <?php echo json_encode($this->usuario_id ?? null); ?>;
    var sessionLifetime = <?php echo json_encode($this->sessionLifetime ?? 0); ?>;

    // Verificar si hay sesiones expiradas (basado en la respuesta del backend)
    if (expired_sessions) {
        Swal.fire({
            title: '¿Deseas extender la sesión?',
            text: 'Tu sesión está a punto de expirar. ¿Quieres continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e3a8a', // Deep blue for confirm
            cancelButtonColor: '#ef4444', // Modern red for cancel
            confirmButtonText: 'Extender',
            cancelButtonText: 'Cerrar sesión',
            customClass: {
                popup: 'modern-swal-popup',
                title: 'modern-swal-title',
                content: 'modern-swal-content',
                confirmButton: 'modern-swal-confirm',
                cancelButton: 'modern-swal-cancel'
            },
            backdrop: 'rgba(0, 0, 0, 0.9)', // Slightly darker backdrop
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster' // Smooth entrance
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster' // Smooth exit
            },
            allowOutsideClick: false, // Prevent clicking outside the modal
            allowEscapeKey: false, // Prevent closing with Escape key
            allowEnterKey: false // Prevent closing with Enter key
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
                            // Si la extensión fue exitosa, recargar la página para aplicar los cambios
                            location.reload(true);
                        } else {
                            // Si hubo un error al extender, forzar el logout
                            Swal.fire({
                                icon: 'error',
                                title: 'No se pudo extender',
                                text: (resp && resp.message) || 'Intente nuevamente.'
                            });
                            setTimeout(() => { window.location.href = redirect; }, 2000);
                        }
                    } catch (e) {
                        Swal.fire({ icon: 'error', title: 'Error', text: 'Respuesta inválida del servidor.' });
                        setTimeout(() => { window.location.href = redirect; }, 2000);
                    }
                };
                xhr.onerror = function() {
                    Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo contactar al servidor.' });
                    setTimeout(() => { window.location.href = redirect; }, 2000);
                };
                xhr.send('extend=1');
            } else {
               // El usuario hizo clic en "No, cerrar sesión"
                var xhrLogout = new XMLHttpRequest();
                xhrLogout.open('POST', `${ENDPOINT_BASE}${APP_PATH}api/users/logout`); // Llama al nuevo endpoint
                xhrLogout.onload = function() {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión Expiró.',
                        text: 'Por su seguridad la sección fue cerrada.',
                        color: '#1e3a8a', // Deep blue for text
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        customClass: {
                            popup: 'modern-swal-popup1',
                            title: 'modern-swal-title1',
                            content: 'modern-swal-content1',
                            timerProgressBar: 'modern-swal-progress-bar1'
                        },
                        backdrop: 'rgba(0, 0, 0, 0.9)', // Slightly darker backdrop
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown animate__faster' // Smooth entrance
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp animate__faster' // Smooth exit
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