
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress  = resetTimer;
    document.onclick     = resetTimer;     // touchpad clicks

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(sessionOut, 900000);//900000
        // 1000 milliseconds = 1 second
    }

function sessionOut(){

$.confirm({
   title: 'Cerrar Sesión',
    content: 'Tienes mucho tiempo inactivo, tu sesión se cerrará en 15 segundos.',
    autoClose: 'logoutUser|15000',
    buttons: {
        logoutUser: {
            text: 'Cerrar',
            action: function () {
                //original
                //xajax_logout();
                //nuevo codigo
                $.ajax({
                    url: 'app/plugins/utility/funciones/jsLogout/logout.php',
                    type: 'POST',

                    success: function()
                    {
                      window.location.href = "https://sistemas.sacs.gob.ve/certificado/";
                    }
                });

            }

        },
        cancel: {
            text: 'Extender Sesión',
            cancel: function(){}

        }

    }
});


}

function logout(){

    $.ajax({
        url: 'app/plugins/utility/funciones/jsLogout/logout.php',
        type: 'POST',

        success: function()
        {
          window.location.href = "https://sistemas.sacs.gob.ve/certificado/";
        }
    });

}