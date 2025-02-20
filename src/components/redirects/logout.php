<?php

session_start();
session_destroy();
header('Location: ../../api/login.php');
exit();
?>