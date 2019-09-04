<?php
  $DOCUMENT_ROOT = rtrim( getenv("DOCUMENT_ROOT"), "/\\" );
  @include_once( $DOCUMENT_ROOT . '/php/mail/unicode.inc.php' );
  @include_once( $DOCUMENT_ROOT . '/php/mail/mail.inc.php' );

  $name = $_POST['f_ContactName'] ?: "–";
  $phone = $_POST['f_Telephone'];

  $shape = $_POST['f_Forma'][0] ?: "–";
  $length = $_POST['f_Length'] ?: "–";
  $width = $_POST['f_Width'] ?: "–";
  $diameter = $_POST['f_Diameter'] ?: "–";
  $longNap = $_POST['f_LongNap'] == "on" ? "да" : "–";
  $material = $_POST['f_Material'][0] ?: "–";
  $discount = $_POST['f_Discount'][0] ?: "–";
  $followerDiscount = $_POST['f_FollowerDiscount'] ?: "–";
  $totalOriginal = $_POST['f_TotalOriginal'] ?: 0;
  $totalDiscount = $_POST['f_TotalDiscount'] ?: 0;

  if ($length > 0 && $width > 0) {
    $diameter = "–";
  }

  $to = "sensetive5@yandex.ru";
  $subject = "Новая заявка с сайта " . $_SERVER['HTTP_HOST'];

  $headers = "From: info@" . $_SERVER["HTTP_HOST"] . "\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

  $message = "
    <h3>Заявка на химчистку</h3>
    <p><b>Контактное лицо: </b>". $name . "</p>
    <p><b>Телефон: </b>". $phone . "</p>
    <hr>
    <p><b>Форма ковра: </b>" . $shape . "</p>
    <p><b>Длина, м: </b>" . $length . "</p>
    <p><b>Ширина, м: </b>" . $width . "</p>
    <p><b>Диаметр, м: </b>" . $diameter . "</p>
    <p><b>Длинный ворс: </b>" . $longNap . "</p>
    <p><b>Материал: </b>" . $material . "</p>
    <p><b>Скидка: </b>" . $discount . "%</p>
    <p><b>Скидка подписчика: </b>" . $followerDiscount . "%</p>
    <p><b>Цена без скидки: </b>" . $totalOriginal . " руб.</p>
    <p><b>Цена со скидкой: </b>" . $totalDiscount . " руб.</p>
  ";

  mail($to, $subject, $message, $headers);

  $responce = [
    "status" => "success",
    "text" => "Ваша заявка принята! <br> Скоро мы свяжемся с вами."
  ];

  echo json_encode($responce);
  exit;
?>