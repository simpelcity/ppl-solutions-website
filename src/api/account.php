<?php

$connectionPath = realpath(__DIR__ . "/../components/redirects/connection.php");

if ($connectionPath) {
    include $connectionPath;
} else {
    die("Error: connection.php file not found.");
}

if (!isset($_COOKIE['loggedInUser'])) {
    header("Location: ./login.php");
    exit();
}

$id = $_COOKIE['loggedInUser'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['']))
    if (isset($_POST['upload'])) {
        if (isset($_FILES['pfp']) && $_FILES['pfp']['error'] === 0) {
            $fileTmp = $_FILES['pfp']['tmp_name'];
            $fileName = $_FILES['pfp']['name'];
            $fileType = $_FILES['pfp']['type'];
            $fileSize = $_FILES['pfp']['size'];
    
            $allowed = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($fileType, $allowed)) {
                die("Invalid file type. Only JPG, PNG and GIF are allowed.");
            }
    
            $fileData = file_get_contents($fileTmp);
            $fileData = base64_encode($fileData);
    
            $stmt = $pdo->prepare("UPDATE users SET profile_picture = :profile_picture WHERE id = :id");
            $stmt->bindParam(':profile_picture', $fileData);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
        } else {
            echo "Error uploading file.";
        }
    }
}


$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
$user = $stmt->fetch();
$pfp = $user['profile_picture'] ? "data:image/jpeg;base64," . $user['profile_picture'] : "../pages/media/default_profile.png";

?>
<!doctype html>
<html lang="en" class="overflow-x-hidden h-100 w-100 m-0 p-0">
    <head>
        <title>Drivershub | PPL Solutions</title>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <!-- Bootstrap CSS v5.2.1 -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
        />
        <link rel="stylesheet" href="../pages/css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <script src="https://kit.fontawesome.com/555ef81382.js" crossorigin="anonymous"></script>
        <link rel="icon" type="image/x-icon" href="../pages/media/favicon.ico">
        <script src="member.js"></script>
        <style>
            body {
                font-family: IBM Plex Mono;
            }
        </style>
    </head>

    <body class="bg-light overflow-x-hidden h-100 w-100 m-0 p-0 fw-500">
        <header class="text-light position-relative top-0 left-0 right-0 z-1 w100 my-0 mx-auto p-0">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid w-100 px-0">
                    <!-- Brand Logo and Name -->
                     <a class="navbar-brand d-flex align-items-center" href="../index.html">
                        <img class="rounded-circle me-2 ms-3" src="../pages/media/ppls_logo.png" alt="PPL Solutions Logo" width="50" height="50">
                        <p class="my-auto">PPL Solutions VTC</p>
                     </a>

                     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle Navigation">
                        <span class="navbar-toggler-icon"></span>
                     </button>

                     <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav w-100 justify-content-center">
                            <li class="nav-item mx-2 rounded"><a class="nav-link text-uppercase text-light" href="../index.html">Home</a></li>
                            <li class="nav-item mx-2 rounded"><a class="nav-link text-uppercase text-light" href="../pages/events/events.html">Events</a></li>
                            <li class="nav-item mx-2 rounded"><a class="nav-link text-uppercase text-light" href="../pages/team.html">Team</a></li>
                            <li class="nav-item mx-2 rounded"><a class="nav-link text-uppercase text-light" href="../pages/gallery.html">Gallery</a></li>
                            <li class="nav-item mx-2 rounded"><a class="nav-link text-uppercase text-light" href="../pages/contact-us.html">Contact us</a></li>
                        </ul>
                        <div class="navbar-buttons d-flex ms-lg-3">
                            <a class="text-light btn border border-2 border-primary bg-secondary me-2 text-decoration-none py-1 px-2" href="../pages/apply.html">Apply</a>
                            <a class="text-light btn border border-2 border-primary bg-secondary me-3 text-decoration-none py-1 px-2" href="drivershub.php">Drivershub</a>
                        </div>
                     </div>
                </div>
            </nav>
        </header>
        <main>
            <div class="profile-banner bg-danger d-flex justify-content-center">
                <div class="card col-8">
                    <div class="card-body">
                        <div class="row">
                            <div class="profile-picture">
                                <img src="<?= $pfp ?>" alt="pfp of <?= $user['username'] ?>" class="rounded-circle object-fit-cover" width="160" height="160">
                            </div>
                            <div class="details">
                                <h3><?= $user['username'] ?></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer class="text-light py-4 w-100 my-0 mx-auto p-0 text-start bg-primary">
            <div class="container-fluid w-100 px-0">
                <div class="row mx-3">
                    <div class="col-12 col-md-6 footer1 my-3">
                        <div class="d-flex align-items-center mb-3">
                            <a class="d-flex flex-row text-decoration-none color-light" href="../index.html">
                                <img class="rounded-circle me-2" src="../pages/media/ppls_logo.png" alt="PPL Solutions Logo" width="50" height="50">
                                <h3 class="my-auto text-light fw-600">PPL Solutions VTC</h3>
                            </a>
                        </div>
                        <p class="fs-5">Founded on 7 September 2024, our goal is to create a community where people can connect and enjoy trucking together.</p>
                        <div>
                            <a href="https://discord.gg/mnKcKwsYm4" target="_blank" class="text-light me-1"><i class="fa-brands fs-4 fa-discord bg-info rounded-circle padding-icon mt-2"></i></a>
                            <a href="https://www.tiktok.com/@pplsolutionsvtc" target="_blank" class="text-light"><i class="fa-brands fs-4 fa-tiktok bg-black padding-tiktok rounded-circle"></i></a>
                            <a href="https://truckersmp.com/vtc/74455" target="_blank" class="text-light"><i class="fa-solid fs-4 fa-truck bg-black padding-icon rounded-circle"></i></a>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 footer2 my-3">
                        <div class="d-flex">
                            <div class="col-12 col-lg-4">
                                <h3 class="fw-600">Pages</h3>
                                <ul class="list-unstyled p-0 fs-5">
                                    <li><a class="text-light text-decoration-none" href="../index.html"><i class="fa-solid fa-angle-right"></i> Home</a></li>
                                    <li><a class="text-light text-decoration-none" href="../pages/events/events.html"><i class="fa-solid fa-angle-right"></i> Events</a></li>
                                    <li><a class="text-light text-decoration-none" href="../pages/team.html"><i class="fa-solid fa-angle-right"></i> Team</a></li>
                                    <li><a class="text-light text-decoration-none" href="../pages/gallery.html"><i class="fa-solid fa-angle-right"></i> Gallery</a></li>
                                    <li><a class="text-light text-decoration-none" href="../pages/contact-us.html"><i class="fa-solid fa-angle-right"></i> Contact Us</a></li>
                                </ul>
                            </div>
                            <div class="col-12 col-lg-8 fs-5">
                                <ul class="nav nav-tabs justify-content-center w-100" id="footerTabs" role="tablist">
                                    <li class="nav-item m-0 w-50" role="presentation">
                                        <a class="nav-link active text-center m-0" id="home-tab" data-bs-toggle="pill" href="#links" role="tab" aria-controls="home" aria-selected="true">Other links</a>
                                    </li>
                                    <li class="nav-item m-0 w-50" role="presentation">
                                        <a class="nav-link text-center m-0" id="contact-tab" data-bs-toggle="pill" href="#message" role="tab" aria-controls="contact" aria-selected="false">Message</a>
                                    </li>
                                </ul>
                                <div class="tab-content mt-4" id="footerTabsContent">
                                    <div class="tab-pane fade show active" id="links" role="tabpanel" aria-labelledby="home-tab">
                                        <ul class="list-unstyled">
                                            <li><a class="text-light text-decoration-none" href="login.php"><i class="fa-solid fa-angle-right"></i> Drivershub</a></li>
                                            <li><a class="text-light text-decoration-none" href="../pages/apply.html"><i class="fa-solid fa-angle-right"></i> Apply</a></li>
                                            <li><a class="text-light text-decoration-none" href="https://truckersmp.com/vtc/74455" target="_blank"><i class="fa-solid fa-angle-right"></i> VTC</a></li>
                                        </ul>
                                    </div>
                                    <div class="tab-pane fade" id="message" role="tabpanel" aria-labelledby="contact-tab">
                                        <p>Hello there traveler, My name is <strong>Wietsegaming</strong>. Welcome on the website of the Virtual Trucking Company: <strong>PPL Solutions</strong>, we stand for driver comfort and the fun in doing great things together.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="border-top border-light pt-3"><i class="bi bi-c-circle"></i> Copyright 2025 <strong>PPL Solutions.</strong> All rights Reserved | Designed and developed by <strong>Wietsegaming</strong></p>
                </div>
            </div>
        </footer>
        <!-- Bootstrap JavaScript Libraries -->
        <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
            integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
            crossorigin="anonymous"
        ></script>

        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
            integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
            crossorigin="anonymous"
        ></script>
    </body>
</html>
