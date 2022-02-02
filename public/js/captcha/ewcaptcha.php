<?php
namespace <#= ProjectNamespace #>;

// Session
session_start();

// Autoload
include_once "<#= GetFileName("autoload") #>";

// Captcha
$_SESSION[SESSION_CAPTCHA_CODE] = Captcha()->show();
?>