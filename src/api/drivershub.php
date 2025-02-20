<?php

if (!isset($_COOKIE['loggedInUser'])) {
    echo "not logged in.";
    exit();
}

$username = $_COOKIE['username'];
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
        <script src="../pages/drivershub/drivershub.js"></script>
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
                            <a class="text-light btn border border-2 border-primary bg-secondary me-3 text-decoration-none py-1 px-2" href="login.php">Drivershub</a>
                        </div>
                     </div>
                </div>
            </nav>
        </header>
        <main>
            <div>
                <div class="banner">
                    <img class="banner-img w-100 object-fit-cover" src="../pages/media/banner.png">
                </div>
                <section class="col-12 text-center my-3">
                    <h1 class="text-primary fw-700">Drivershub panel</h1>
                </section>
                <div class="text-center driver d-flex justify-content-center text-primary">
                    <h2 class="fw-600 mx-3">Welcome back,</h2>
                    <h2 class="fw-600" id="driver-user"><?php echo $username ?></h2>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="card bg-dark rounded-4 col-12 col-lg-11">
                        <div class="card-header text-center">
                            <h2 class="text-primary fw-600">User Jobs</h2>
                        </div>
                        <div class="card-body">
                            <div class="container-fluid d-flex flex-column align-items-center text-light scroll">
                                <table class="mx-auto">
                                    <thead class="bg-primary">
                                        <tr>
                                            <th class="rounded-start py-2 px-3">Username</th>
                                            <th class="py-2 px-3">Game</th>
                                            <th class="py-2 px-3">From - To</th>
                                            <th class="py-2 px-3">Cargo</th>
                                            <th class="py-2 px-3">Truck</th>
                                            <th class="py-2 px-3">Distance</th>
                                            <th class="rounded-end py-2 px-3">Income</th>
                                        </tr>
                                    </thead>
                                    <tbody id="container"></tbody>
                                </table>
                            </div>
                            <div class="navigation mt-2 d-flex justify-content-center">
                                <button class="btn border border-2 border-primary text-light mb-3 mx-2" id="previous">
                                    <span id="buttonText">Previous</span>
                                    <div id="dotSpinner" class="dot-spinner hidden left-37">
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                    </div>
                                </button>
                                <button class="btn border border-2 border-primary text-light mb-3 mx-2" id="next">
                                    <span id="buttonText">Next</span>
                                    <div id="dotSpinner" class="dot-spinner hidden left-20">
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                        <div class="dot-spinner__dot"></div>
                                    </div>
                                </button>
                            </div>
                            <div class="nav-info d-flex flex-row justify-content-center my-auto text-light">
                                <p>Page&nbsp;</p><p id="currentPages">1</p>&nbsp;of&nbsp;<p id="totalPages">1</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <a class="text-decoration-none text-center btn border border-2 border-primary text-primary my-3" id="logout" href="logout.php">Logout</a>
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
        <script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyAS4-Nea-8pEmekBMFIinMEWGgBZJtPK-w",
            authDomain: "ppl-solutions-vtc.firebaseapp.com",
            projectId: "ppl-solutions-vtc",
            storageBucket: "ppl-solutions-vtc.firebasestorage.app",
            messagingSenderId: "97500814851",
            appId: "1:97500814851:web:8f3db6f4b4c487dc153836",
            measurementId: "G-NLHRG7919N"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        </script>
    </body>
</html>
