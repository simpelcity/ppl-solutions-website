<?php

include_once('connection.php');

session_start();

if (!isset($_SESSION['loggedInUser'])) {
    header('Location: login.php');
    die();
}

?>
<!doctype html>
<html lang="en">
    <head>
        <title>Apply | PPL Solutions</title>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <!-- Bootstrap CSS v5.2.1 -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
        />
        <link rel="stylesheet" href="style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <script src="https://kit.fontawesome.com/555ef81382.js" crossorigin="anonymous"></script>
        <link rel="icon" type="image/x-icon" href="media/favicon.ico">

        <style>
            /* Global Reset */
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                overflow-x: hidden;
            }

            header, footer {
                width: 100%;
                margin: 0 auto;
                padding: 0; /* Remove any default padding */
            }

            /* Ensure full-width with no padding */
            header .container-fluid, 
            footer .container-fluid {
                width: 100%;
                padding-left: 0;
                padding-right: 0;
            }

            /* Hero image alignment */
            .position-relative img {
                max-width: 100%;
                height: auto;
                display: block;
            }

            /* Footer tweaks for better responsiveness */
            footer {
                text-align: left;
            }
        </style>
    </head>

    <body class="d-flex flex-column w-100">
        <header class="text-white">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <!-- Brand Logo and Name -->
                    <a class="navbar-brand d-flex align-items-center" href="Home.html">
                        <img class="rounded-circle me-2 ms-4" src="media/ppls_logo.png" alt="Logo" width="50" height="50">
                        <p>PPL Solutions VTC</p>
                    </a>

        
                    <!-- Toggle Button for Mobile -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
        
                    <!-- Collapsible Menu -->
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav w-100 justify-content-center">
                            <li class="nav-item"><a class="nav-link" href="Home.html">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="Events.html">Events</a></li>
                            <li class="nav-item"><a class="nav-link" href="Team.html">Team</a></li>
                            <li class="nav-item"><a class="nav-link" href="Gallery.html">Gallery</a></li>
                            <li class="nav-item"><a class="nav-link" href="Contact us.html">Contact us</a></li>
                        </ul>
                        <div class="navbar-buttons d-flex ms-lg-3">
                            <a class="apply me-2 rounded" href="Apply.html">Apply</a>
                            <a class="vtc me-4 rounded" href="https://truckersmp.com/vtc/74455" target="_blank">VTC</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        <main>
            <div>
                <div class="banner">
                    <img class="banner-img w-100 object-fit-cover" src="media/banner.png">
                </div>
                <section class="col-12 text-center my-3">
                    <h1>Drivershub panel</h1>
                </section>
                <div class="text-center driver">
                    <h2>Welcome <?= $_GET['username'] ?></h2>
                    <a id="logout" href="logout.php">Uitloggen</a>
                </div>
            </div>
        </main>
        <footer class="text-white py-4">
            <div class="container-fluid">
                <div class="row ms-3">
                    <div class="col-md-6 footer1 mt-3">
                        <div class="d-flex align-items-center mb-3">
                            <a class="d-flex flex-row" href="Home.html">
                                <img class="rounded-circle me-2" src="media/ppls_logo.png" alt="Logo" width="50" height="50">
                                <h3 class="my-auto">PPL Solutions VTC</h3>
                            </a>
                        </div>
                        <p class="">Founded on 7 September 2024, our goal is to create a community where people can connect and enjoy.</p>
                        <div>
                            <a href="https://discord.gg/mnKcKwsYm4" class="text-white me-1"><i class="fa-brands fa-discord mt-2"></i></a>
                            <a href="https://www.tiktok.com/@pplsolutionsvtc" class="text-white"><i class="fa-brands fa-tiktok"></i></a>
                            <a href="https://truckersmp.com/vtc/74455" class="text-white"><i class="fa-solid fa-truck"></i></a>
                        </div>
                    </div>
                    <div class="col-md-6 footer2 mt-3">
                        <h3>Pages</h3>
                        <ul>
                            <li><a class="text-white text-decoration-none" href="Home.html"><i class="fa-solid fa-angle-right"></i> Home</a></li>
                            <li><a class="text-white text-decoration-none" href="Events.html"><i class="fa-solid fa-angle-right"></i> Events</a></li>
                            <li><a class="text-white text-decoration-none" href="Team.html"><i class="fa-solid fa-angle-right"></i> Team</a></li>
                            <li><a class="text-white text-decoration-none" href="Gallery.html"><i class="fa-solid fa-angle-right"></i> Gallery</a></li>
                            <li><a class="text-white text-decoration-none" href="Contact us.html"><i class="fa-solid fa-angle-right"></i> Contact Us</a></li>
                            <li><a class="text-white text-decoration-none" href="Apply.html"><i class="fa-solid fa-angle-right"></i> Apply</a></li>
                        </ul>
                    </div>
                    <p class="border-top border-white pt-3"><i class="bi bi-c-circle"></i> Copyright 2025 <strong>PPL Solutions.</strong> All rights Reserved | Designed and developed by Wietsegaming</p>
                </div>
            </div>
        </footer>

        <!-- Bootstrap JS -->
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