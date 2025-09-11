 <?php
        $expired_sessions = json_encode($this->expired_sessions);
        $message = json_encode($this->message);
        $redirect = json_encode($this->redirect);
        $usuario_id = json_encode($this->usuario_id);
        $sessionLifetime = json_encode($this->sessionLifetime); // Asegúrate de que esto esté presente

        ?>
        <script>
            var expired_sessions = <?php echo $expired_sessions; ?>;
            var message = <?php echo $message; ?>;
            var redirect = <?php echo $redirect; ?>;
            var usuario_id = <?php echo $usuario_id; ?>;
            var sessionLifetime = <?php echo $sessionLifetime; ?>; // Asegúrate de que esto esté presente


            // Verificar si hay sesiones expiradas
            if (expired_sessions) {
            Swal.fire({
                title: '¿Deseas extender la sesión?',
                text: 'Tu sesión está a punto de expirar. ¿Quieres continuar?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, extender',
                cancelButtonText: 'No, cerrar sesión'
            }).then((result) => {
                // La promesa (then) se ejecuta después de que el usuario hace clic en un botón
                if (result.isConfirmed) {
                   
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión Extendida',
                        text: 'Tu sesión ha sido extendida con éxito.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    // El usuario hizo clic en "No, cerrar sesión" o cerró el modal
                    // Se ejecuta el SweetAlert original para notificar del cierre
                    if (expired_sessions) { // O puedes usar la lógica que necesites
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesión Expiró.',
                            text: message,
                            color: 'black',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            willClose: () => {
                                setTimeout(() => {
                                    window.location.href = redirect;
                                }, 500);
                            }
                        });
                    }
                }
            });
            }

            // Agregar lógica de recarga automática
            if (sessionLifetime) {
                setTimeout(function() {
                    location.reload(true); // Forzar recarga desde el servidor
                }, sessionLifetime * 1000); // sessionLifetime está en segundos
            }
        </script>