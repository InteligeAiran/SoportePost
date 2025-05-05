//Llamar a la función PHP usando fetch    SESSION EXPIRE DEL USER
fetch('/SoportePost/app/controllers/dashboard2.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text(); // Obtener la respuesta como texto primero
})
.then(responseText => {
    if (responseText) {
        try {
            const data = JSON.parse(responseText); // Intentar parsear como JSON
            if (data.expired_sessions) {
                window.location.href = data.redirect;
            }

            if (data.sessionLifetime && typeof data.sessionLifetime === 'number') {
                setTimeout(function() {
                    location.reload(true);
                }, data.sessionLifetime * 1000);
            } else {
                console.error('Invalid sessionLifetime:', data.sessionLifetime);
            }
        } catch (error) {
            console.error('JSON parse error:', error);
            console.log('Response text:', responseText); // Mostrar la respuesta para depuración
        }
    } else {
        console.error('Empty response from server');
    }
})
.catch(error => {
    console.error('Fetch error:', error);
});

//// END  SESSION EXPIRE DEL USER