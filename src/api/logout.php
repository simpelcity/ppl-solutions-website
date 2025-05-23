<?php

session_start();
session_destroy();

setcookie("loggedInUser", "", time() - 3600, "/");
setcookie("email", "", time() - 3600, "/");
setcookie("username", "", time() - 3600, "/");

header('Location: /login');
exit();
?>