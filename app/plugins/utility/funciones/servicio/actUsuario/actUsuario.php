<?php
//Función()
function actUsuario($form){
$obj    = new xajaxResponse('UTF-8');
$correo = new PHPMailer();

//variables
$varArr   = $form["arrCod"]; 
$varArr   = explode(",", $varArr);
$filename = $varArr[0];  
$code     = $varArr[1];  
$nombr    = $varArr[3].', '.$varArr[2];

$email    = $form["correo2"]; 
$email    = trim($email);
$email    = strtolower($email);
$emhash   = '!'.$code.'#$'.$email;
$emhash   = base64_encode($emhash);
array_push($varArr, $emhash);

$subject  = utf8_decode('Solicitud para activar su cuenta de usuario en SIACS v2');

extract($varArr);

if (is_file(ROOT.$filename)) {
ob_start();
include 'contents.php';
$content = ob_get_contents();
ob_end_clean();
}

$correo->IsSMTP();
$correo->SMTPAuth = true;
$correo->SMTPSecure = 'tls'; 
$correo->Host = "smtp.gmail.com";
$correo->Port = 587;
$correo->Username   = USER_EMAIL;
$correo->Password   = USER_PASS;
$correo->SetFrom(USER_EMAIL, "OTICSACS");
$correo->AddReplyTo(USER_EMAIL,"OTICSACS");
$correo->AddAddress($email,$nombr);
$correo->Subject = $subject;
$correo->AddEmbeddedImage(ROOT."app/public/images/otic.jpg","logo_otic","logo");
$correo->isHTML(true);
$correo->CharSet = 'UTF-8';
$body = "<head>
          <style type='text/css'> 
            #wrap{background-color:#ccc;padding:0 1rem;}
            #header{background-color:#fff;width:80%;margin-left: auto;margin-right: auto;}
            #logo{max-width:250px;margin-right:2%;}
            img {max-width:100%;height:auto;width: auto/9;}
            #content{background-color:#fff;width:80%;margin-left: auto;margin-right: auto;}
            hr{width:94%;color:#e6e6e6;}
            #boxContent{background-color:#fff;width:94%;margin-left: auto;margin-right: auto;padding: 2%;}
            h2{color:#5CACEE;}
            ul{margin-left: 2%}
            #pLetter{font-size: 12px;}
            #footer{background-color:#5CACEE;padding:0 1rem;color:#fff;}
          </style>
         </head>";
$body.= $content;
$correo->MsgHTML($body);
  
if(!$correo->Send()) {
  echo "Hubo un error: " . $correo->ErrorInfo;
}else{
  $obj->addScript("         
    $('#sendReg').hide('slow');                                    
    $.confirm({
    title: 'Registro Exitoso!',
    content: 'Se ha enviado un mensaje con el asunto: Solicitud para activar su cuenta de usuario en SIACS v2, a su cuenta de correo electrónico ".$email.". Por favor ingrese a su correo, abra el mensaje y siga las indicaciones que lo llevarán al siguiente paso.',
    columnClass: 'medium',
      buttons: {
        confirm: {
            text: 'Aceptar',
            btnClass: 'btn-dark',
            action: function(){
                location.href= 'login_user';
            }
        },
        cancel: {
            text: 'Cancelar',
            btnClass: 'btn-dark',
            action: function(){
                $.alert('Debe notificar registro fallido!');
                location.href= 'login_user';
            }
        }
      }
    });
  "); 

  $obj->addScript("clearRecup();
                   nuevoRegistro(); ");

}  

//$obj->addRedirect("login_user");

return $obj;

}

$xajax->registerFunction("actUsuario"); 

?>