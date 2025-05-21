<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $form = json_decode(file_get_contents('php://input'), true);

    $content = file_get_contents($form['url']);

    die($content);
}

die(json_encode(["error" => 'Only post is allowed']));
