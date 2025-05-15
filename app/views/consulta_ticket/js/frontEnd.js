document.addEventListener('DOMContentLoaded', function() {
    const flatpickrInputs = document.querySelectorAll('.flatpickr-input');

    flatpickrInputs.forEach(input => {
        flatpickr(input, {
            dateFormat: "d/m/Y", // Define el formato como dd/mm/yyyy
            allowInput: true, // Permite escribir directamente en el input
            clickOpens: true, // Abre el calendario al hacer clic en el input
            // Puedes añadir más opciones aquí si lo necesitas
        });
    });
    
    const buscarPorRifBtn = document.getElementById('buscarPorRifBtn');
    const rifInput = document.getElementById('rifInput');
    const buscarRif = document.getElementById('buscarRif');
    const rifCountTableCard = document.querySelector('.card');
    const selectInputRif = document.getElementById('rifTipo');

    const buscarPorSerialBtn = document.getElementById('buscarPorSerialBtn');
    const serialInput = document.getElementById('serialInput');
    const buscarSerial = document.getElementById('buscarSerial');
    const serialCountTableCard = document.querySelector('.card');

    const buscarPorRazonBtn = document.getElementById('buscarPorNombreBtn');
    const razonInput = document.getElementById('RazonInput');
    const buscarRazon = document.getElementById('buscarRazon');
    const razonCountTableCard = document.querySelector('.card');

    const buscarPorRangoBtn = document.getElementById('buscarPorRangoBtn');
    const Rangoinput = document.getElementById('date-ini');
    const Rangoinput1 = document.getElementById('date-end');
    const BuscarRango = document.getElementById('buscarRango');
    const rangoCountTableCard = document.querySelector('.card');

    if (buscarPorRangoBtn && rangoCountTableCard) {
        buscarPorRangoBtn.addEventListener('click', function() {
            rangoCountTableCard.style.display = 'block'; // Muestra la tabla
            Rangoinput.style.display = 'block'; // Muestra el input
            BuscarRango.style.display = 'block'; // Oculta el botón
            Rangoinput1.style.display = 'block'; // Muestra el input

            selectInputRif.style.display = 'none'; // Muestra el select
            buscarRif.style.display = 'none'; // Oculta el botón
            rifInput.style.display = 'none'; // Muestra el input
            serialInput.style.display = 'none'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón
        });
    }

    if (buscarPorRazonBtn && razonCountTableCard) {
        buscarPorRazonBtn.addEventListener('click', function() {
            razonCountTableCard.style.display = 'block'; // Muestra la tabla
            razonInput.style.display = 'block'; // Muestra el input
            buscarRazon.style.display = 'block'; // Oculta el botón

            selectInputRif.style.display = 'none'; // Muestra el select
            buscarRif.style.display = 'none'; // Oculta el botón
            rifInput.style.display = 'none'; // Muestra el input*/

            serialInput.style.display = 'none'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input
            
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }

    if (buscarPorRifBtn && rifCountTableCard) {
        buscarPorRifBtn.addEventListener('click', function() {
            rifCountTableCard.style.display = 'block'; // Muestra la tabla
            rifInput.style.display = 'block'; // Muestra el input
            selectInputRif.style.display = 'block'; // Muestra el select
            buscarRif.style.display = 'block'; // Oculta el botón
            buscarSerial.style.display = 'none'; // Oculta el botón

            serialInput.style.display = 'none';
            buscarRazon.style.display = 'none'; // Oculta el botón
            razonInput.style.display = 'none'; // Oculta el botón

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input

        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }

    if (buscarPorSerialBtn && serialCountTableCard) {
        buscarPorSerialBtn.addEventListener('click', function() {
            serialCountTableCard.style.display = 'block'; // Muestra la tabla
            serialInput.style.display = 'block'; // Muestra el input
            buscarSerial.style.display = 'block'; // Oculta el botón
            selectInputRif.style.display = 'none'; // Muestra el select
            rifInput.style.display = 'none'; // Muestra el input
            buscarRif.style.display = 'none'; // Oculta el botón
            buscarRazon.style.display = 'none'; // Oculta el botón
            razonInput.style.display = 'none'; // Oculta el botón

            Rangoinput.style.display = 'none'; // Muestra el input
            BuscarRango.style.display = 'none'; // Oculta el botón
            Rangoinput1.style.display = 'none'; // Muestra el input
            
        });
    } else {
        console.log('Error: No se encontraron el botón o la tabla.'); // Para verificar si los elementos se seleccionan
    }
});

