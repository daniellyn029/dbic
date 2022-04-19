<?php

////activation email
$mail = new PHPMailer();
$mail->IsSMTP();
////Enable SMTP debugging
//// 0 = off (for production use)
//// 1 = client messages
//// 2 = client and server messages
////$mail->SMTPDebug  = 2;
////$mail->Debugoutput = 'html';
$mail->Host       = 'mail.delsanonline.com';
$mail->Port       = 366;
////$mail->SMTPSecure = 'tls';
$mail->SMTPAuth   = true;
$mail->Username   = "system.msg@delsanonline.com";
$mail->Password   = "Message";
$mail->SetFrom('system.msg@delsanonline.com');
////$mail->AddReplyTo('Support@delsanonline.com');
?>