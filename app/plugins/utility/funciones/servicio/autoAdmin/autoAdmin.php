<?php
//Función()
function autoAdmMail($form){
$obj    = new xajaxResponse('UTF-8');
$correo = new PHPMailer();

//variables
$varArr   = $form["arAdmin"];
$email    = $form["correo"]; 
$varArr   = explode(",", $varArr);
$filename = $varArr[0];  
$nombr    = $varArr[2].', '.$varArr[1];

$subject  = utf8_decode('Activación de cuenta de administrador de usuarios en SIACS v2');

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
}  

//$obj->addRedirect("login_user");

return $obj;

}

$xajax->registerFunction("autoAdmMail"); 

?>