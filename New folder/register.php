<?php

include '../components/redirects/connection.php';

$message = "";
$style = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $checkStmt = $pdo->prepare("SELECT username, email FROM users WHERE email = :email OR username = :username");
    $checkStmt->bindParam(":email", $email);
    $checkStmt->bindParam(":username", $username);
    $checkStmt->execute();
    $existingUser = $checkStmt->fetch();

    if ($existingUser) {
        if ($existingUser['email'] === $email) {
            $message = "Email is already in use.";
        }
        if ($existingUser['username'] === $username) {
            $message .= ($message ? " " : " ") . "Username is already taken";
        }
        $style = "text-warning";
    } else {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword); // hehe not today

        if ($stmt->execute()) {
            $message = "Account created successfully";
            $style = "text-success";
        } else {
            $message = "Error: " . implode(" ", $stmt->errorInfo());
            $style = "text-danger";
        }
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
        <link rel="stylesheet" href="./css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <script src="https://kit.fontawesome.com/555ef81382.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
        <link rel="icon" type="image/x-icon" href="./media/favicon.ico">
        <style>
            body {
                font-family: IBM Plex Mono;
            }
        </style>
    </head>

    <body class="overflow-x-hidden h-100 w-100 m-0 p-0 fw-500 background">
        <header>
            <!-- place header here -->
        </header>
        <main class="h-100">
            <div class="h-100">
                <div class="container h-100 d-flex justify-content-center align-items-center">
                    <div class="contact-form h-100 col-12 col-md-10 col-lg-8 col-xl-6">
                        <form method="post" class="my-4 p-4 h-auto shadow rounded bg-white">
                            <div class="row text-center">
                                <i class="bi bi-person-circle"></i>
                                <h5 class="text-center p-2 mb-4">Create Your Account</h5>
                            </div>
                            <?php if ($message): ?>
                                <div class="<?php echo $style; ?>">
                                    <div class="d-flex">
                                        <?php echo $message ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="mb-2">
                                <label for="username"><i class="fa fa-user"></i> User Name</label>
                                <input type="text" name="username" id="username" class="form-control input" required>
                            </div>
                            <div class="mb-2 mt-2">
                                <label for="email"><i class="fa fa-envelope"></i> Email</label>
                                <input type="text" name="email" id="email" class="form-control input" required>
                            </div>
                            <div class="mb-2 mt-2">
                                <label for="password"><i class="fa fa-lock"></i> Password</label>
                                <input type="text" name="password" id="password" class="form-control input" required>
                            </div>
                            <div class="mb-2 mt-3">
                                <button type="submit" class="btn btn-primary text-light">Create Account</button>
                            </div>
                            <div class="mb-2 mt-4">
                                <p class="text-center">I have an Account <a class="text-decoration-none" href="login.php">Login</a></p>
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
    </body>
</html>
