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
    $confirmPassword = $_POST['confirm_password'];

    if ($password === $confirmPassword) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = :password WHERE email = :email");
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":email", $email);

        if ($stmt->execute()) {
            $message = "Password updated successfully";
            $style = "text-success";
        } else {
            $message = "Error updating password";
            $style = "text-danger";
        }
    } else {
        $message = "Passwords do not match";
        $style = "text-warning";
    }
}
?>
<!doctype html>
<html lang="en" class="overflow-x-hidden h-100 w-100 m-0 p-0">
    <head>
        <title>Register | PPL Solutions</title>
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

    <body class="bg-light overflow-x-hidden h-100 w-100 m-0 p-0 fw-500 background">
        <header>
            <!-- place header here -->
        </header>
        <main class="h-100">
            <div class="h-100">
                <div class="container h-100 d-flex justify-content-center">
                    <div class="contact-form h-100 col-12 col-md-10 col-lg-8 col-xl-6 d-flex align-items-center">
                        <form action="" method="post" class="my-4 p-4 h-auto shadow rounded bg-white w-100">
                            <div class="row text-center">
                                <i class="bi bi-person-circle"></i>
                                <h5 class="text-center p-2">Change Your Password</h5>
                            </div>
                            <?php if ($message): ?>
                                <div class="<?php echo $style; ?>">
                                    <div class="d-flex">
                                        <?php echo $message ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="col-mb-3 position-relative">
                                <label for="email"><i class="fa fa-envelope"></i> Email</label>
                                <input type="text" name="email" id="email" class="form-control input" required>
                                <span id="email-check" class="position-absolute"></span>
                            </div>
                            <div class="col mb-3 mt-3">
                                <label for="password"><i class="fa fa-lock"></i> Password</label>
                                <div class="input-box">
                                    <input type="password" name="password" id="password" class="form-control input" required>
                                    <img src="/pages/media/eye-close.png" id="eyeicon">
                                </div>
                            </div>
                            <div class="col mb-3 mt-3">
                                <label for="confirm_password"><i class="fa fa-lock"></i> Confirm Password</label>
                                <div class="input-box">
                                    <input type="password" name="confirm_password" id="confirm_password" class="form-control input" required>
                                    <img src="/pages/media/eye-close.png" id="confirm_eyeicon">
                                </div>
                            </div>
                            <div class="col mb-3 mt-3">
                                <button type="submit" class="btn btn-primary text-light">Reset Password</button>
                            </div>
                            <div class="col mb-2 mt-4 text-center">
                                <a class="text-decoration-none" href="/register">Create Account</a> OR <a class="text-decoration-none" href="/login">Login</a>
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
            let confirmPassword = document.getElementById('confirm_password');
            let confirmEyeicon = document.getElementById('confirm_eyeicon');

            eyeicon.onclick = function() {
                if (password.type == 'password') {
                    password.type = 'text';
                    eyeicon.src = '/pages/media/eye-open.png';
                } else {
                    password.type = 'password';
                    eyeicon.src = '/pages/media/eye-close.png';
                }
            }

            confirmEyeicon.onclick = function() {
                if (confirmPassword.type == 'password') {
                    confirmPassword.type = 'text';
                    confirmEyeicon.src = '/pages/media/eye-open.png';
                } else {
                    confirmPassword.type = 'password';
                    confirmEyeicon.src = '/pages/media/eye-close.png';
                }
            }
        </script>
        <script>
        $(document).ready(function () {
            $('#email').on('blur', function () {
                var email = $(this).val();
                if (email) {
                    $.ajax({
                        url: '../components/redirects/check_email.php',
                        type: 'POST',
                        data: { email: email },
                        success: function (response) {
                            if (response == 'exists') {
                                $('#email-check').html('<i class="fa fa-check text-success"></i>');
                            } else {
                                $('#email-check').html('<i class="fa fa-times text-danger"></i>');
                            }
                        }
                    });
                } else {
                    $('#email-check').html('');
                }
            });
        });
    </script>
    </body>
</html>
