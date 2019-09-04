<?php
  $DOCUMENT_ROOT = rtrim( getenv("DOCUMENT_ROOT"), "/\\" );
  @include_once( $DOCUMENT_ROOT . '/php/mail/unicode.inc.php' );
  @include_once( $DOCUMENT_ROOT . '/php/mail/mail.inc.php' );

  $name = $_POST['f_ContactName'] ?: "–";
  $phone = $_POST['f_Telephone'];

  $to = "sensetive5@yandex.ru";
  $subject = "Новая заявка с сайта " . $_SERVER['HTTP_HOST'];

  $headers = "From: info@" . $_SERVER["HTTP_HOST"] . "\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

  $message = "
    <h3>Заявка на консультацию</h3>
    <p><b>Контактное лицо: </b>". $name . "</p>
    <p><b>Телефон: </b>". $phone . "</p>
  ";

  mail($to, $subject, $message, $headers);

  $responce = [
    "status" => "success",
    "text" => "Ваша заявка принята! <br> Скоро мы свяжемся с вами."
  ];

  echo json_encode($responce);
  exit;
?>