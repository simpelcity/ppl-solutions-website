<?php

$connectionPath = realpath(__DIR__ . "/../components/redirects/connection.php");

if ($connectionPath) {
    include $connectionPath;
} else {
    die("Error: connection.php file not found.");
}

$message = "";
$style = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE email = :email");
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user) {
            if (password_verify($password, $user['password'])) {
                $message = "Login successful";
                $style = "text-success";

                setcookie("loggedInUser", $user['id'], time() + 3600, "/", "", false, true);
                setcookie("email", $email, time() + 3600, "/", "", false, true);
                setcookie("username", $user['username'], time() + 3600, "/", "", false, true);

                header("Location: /drivershub");
                exit();
            } else {
                $message = "Incorrect password";
                $style = "text-center text-danger";
            }
        } else {
            $message = "Email not found";
            $style = "text-warning";
        }
    } catch (PDOException $e) {
        $message = "Database error: " . $e->getMessage();
        $style = "text-danger";
    }
}

?>
<!doctype html>
<html lang="en" class="overflow-x-hidden h-100 w-100 m-0 p-0">
    <head>
        <title>Login | PPL Solutions</title>
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
        <link rel="stylesheet" href="/pages/css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <script src="https://kit.fontawesome.com/555ef81382.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
        <link rel="icon" type="image/x-icon" href="/pages/media/favicon.ico">
        <style>
            body {
                font-family: IBM Plex Mono;
            }
        </style>
    </head>

    <body class="overflow-x-hidden vh-100 vw-100 m-0 p-0 fw-500 background">
        <header class="text-light position-relative top-0 left-0 right-0 z-1 w100 my-0 mx-auto p-0">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid w-100 px-0">
                    <!-- Brand Logo and Name -->
                     <a class="navbar-brand d-flex align-items-center" href="/">
                        <img class="rounded-circle me-2 ms-3" src="/pages/media/ppls_logo.png" alt="PPL Solutions Logo" width="50" height="50">
                        <p class="my-auto">PPL Solutions VTC</p>
                     </a>

                     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle Navigation">
                        <span class="navbar-toggler-icon"></span>
                     </button>

                     <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav w-100 justify-content-center">
                            <li class="nav-item rounded"><a class="nav-link text-uppercase text-light" href="/">Home</a></li>
                            <li class="nav-item rounded"><a class="nav-link text-uppercase text-light" href="/events">Events</a></li>
                            <li class="nav-item rounded"><a class="nav-link text-uppercase text-light" href="/team">Team</a></li>
                            <li class="nav-item rounded"><a class="nav-link text-uppercase text-light" href="/gallery">Gallery</a></li>
                            <li class="nav-item rounded"><a class="nav-link text-uppercase text-light" href="/contact">Contact us</a></li>
                        </ul>
                        <div class="navbar-buttons d-flex ms-lg-3">
                            <a class="text-light btn border border-2 border-primary bg-secondary me-2 text-decoration-none py-1 px-2" href="/apply">Apply</a>
                            <a class="text-light btn border border-2 border-primary bg-secondary me-3 text-decoration-none py-1 px-2" href="/login">Drivershub</a>
                        </div>
                     </div>
                </div>
            </nav>
        </header>
        <main class="main">
            <div class="h-100">
                <div class="container h-100 d-flex justify-content-center align-items-center">
                    <div class="col-12 col-md-10 col-lg-8 col-xl-6">
                        <form method="post" class="my-4 p-4 h-auto shadow rounded bg-white w-100">
                            <div class="row text-center">
                                <i class="bi bi-person-circle"></i>
                                <h5 class="text-center p-2">Login Into Your Account</h5>
                            </div>
                            <?php if ($message): ?>
                                <div class="<?php echo $style; ?>">
                                    <div class="d-flex">
                                        <?php echo $message ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="col-mb-3">
                                <label for="email"><i class="fa fa-envelope"></i> Email</label>
                                <input type="text" name="email" id="email" class="form-control input" required>
                            </div>
                            <div class="col mb-3 mt-3">
                                <label for="password"><i class="fa fa-lock"></i> Password</label>
                                <div class="input-box">
                                    <input type="password" name="password" id="password" class="form-control input" required>
                                    <img src="/pages/media/eye-close.png" id="eyeicon">
                                </div>
                            </div>
                            <div class="col mb-3 mt-3">
                                <button type="submit" class="btn btn-primary text-light">Login</button>
                            </div>
                            <div class="col mb-2 mt-4 text-center">
                                <a class="text-decoration-none" href="/register">Create Account</a> OR <a class="text-decoration-none" href="/reset">Forgot Password</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <!-- place footer here -->
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
        <script>
            let eyeicon = document.getElementById('eyeicon');
            let password = document.getElementById('password');

            eyeicon.onclick = function() {
                if (password.type == 'password') {
                    password.type = 'text';
                    eyeicon.src = '/pages/media/eye-open.png';
                } else {
                    password.type = 'password';
                    eyeicon.src = '/pages/media/eye-close.png';
                }
            }
        </script>
    </body>
</html>
