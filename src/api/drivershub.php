<?php

if (!isset($_COOKIE['loggedInUser'])) {
	header("Location: /login");
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
		content="width=device-width, initial-scale=1, shrink-to-fit=no" />

	<!-- Bootstrap CSS v5.2.1 -->
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
		rel="stylesheet"
		integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
		crossorigin="anonymous" />
	<link rel="stylesheet" href="/assets/styles/css/style.css">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
	<script src="https://kit.fontawesome.com/555ef81382.js" crossorigin="anonymous"></script>
	<link rel="icon" type="image/x-icon" href="/assets/icons/favicon.ico">
	<script src="/modules/drivershub/drivershub.js"></script>
	<style>
		body {
			font-family: IBM Plex Mono;
		}
	</style>
	<script>
		fetch("/components/navbar/navbar.html")
			.then((response) => response.text())
			.then((data) => {
				document.getElementById("navbar").innerHTML = data;
			});
		fetch("/components/footer/footer.html")
			.then((response) => response.text())
			.then((data) => {
				document.getElementById("footer").innerHTML = data;
			});
	</script>
</head>

<body class="bg-light overflow-x-hidden h-100 w-100 m-0 p-0 fw-500">
	<header id="navbar" class="text-light position-relative top-0 left-0 right-0 z-1 w100 my-0 mx-auto p-0 bg-dark">

	</header>
	<main>
		<div>
			<div class="col-12 position-relative m-0">
				<div class="banner">
					<img class="banner-img w-100 object-fit-cover" src="/assets/images/banner.png">
				</div>
				<div class="title text-center">
					<h1 class="text-primary fw-700">Drivershub</h1>
				</div>
			</div>
			<div class="text-center driver d-flex justify-content-center text-primary my-3">
				<h2 class="fw-600 mx-3">Welcome back,</h2>
				<h2 class="fw-600" id="driver-user"><?php echo $username ?></h2>
			</div>
			<div class="mx-2">
				<div class="d-flex justify-content-center">
					<div class="card bg-dark rounded-4 col-12 col-lg-11 w-100">
						<div class="card-header text-center">
							<h2 class="text-primary fw-600">User Jobs</h2>
						</div>
						<div class="card-body">
							<div class="container-fluid d-flex flex-column align-items-center text-light scroll">
								<table class="mx-auto">
									<thead class="bg-primary">
										<tr id="tableHeader">
											<th id="e0" class="rounded-start">Date</th>
											<th id="e1" class="">Username</th>
											<th id="e2" class="">Game</th>
											<th id="e3" class="">From - To</th>
											<th id="e4" class="">Cargo</th>
											<th id="e5" class="">Truck</th>
											<th id="e6" class="">Distance</th>
											<th id="e7" class="rounded-end">Income</th>
										</tr>
									</thead>
									<tbody id="container">
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
										<tr id="placeholder">
											<td id="e00" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e01" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e02" class="py-2 px-3 text-uppercase"><span class="placeholder col-12"></span></td>
											<td id="e03" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e04" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e05" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e06" class="py-2 px-3"><span class="placeholder col-12"></span></td>
											<td id="e07" class="py-2 px-3"><span class="placeholder col-12"></span></td>
										</tr>
									</tbody>
								</table>
								<p id="error"></p>
							</div>
							<div class="navigation mt-2 d-flex justify-content-center">
								<button class="btn border border-2 border-primary text-light mb-3 mx-2" id="previous">
									<span id="buttonText">Previous</span>
								</button>
								<button class="btn border border-2 border-primary text-light mb-3 mx-2" id="overview">
									<span id="overviewButtonText" class="">Overview</span>
									<div id="loaderOverview" class="loader hidden mx-auto"></div>
								</button>
								<button class="btn border border-2 border-primary text-light mb-3 mx-2" id="next">
									<span id="nextButtonText" class="">Next</span>
									<div id="loaderNext" class="loader hidden mx-auto"></div>
								</button>
							</div>
							<div class="nav-info d-flex flex-column align-items-center text-light">
								<div id="pagination" class="">
									<span>Page&nbsp;</span><span id="currentPage">1</span><span>&nbsp;of&nbsp;</span><span id="totalPages">1</span>
								</div>
								<div id="allJobs" class="hidden"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="d-flex justify-content-center">
				<a class="text-decoration-none text-center btn border border-2 border-primary text-primary my-3" id="logout" href="/logout">Logout</a>
			</div>
		</div>
	</main>
	<footer id="footer" class="text-light py-4 w-100 my-0 mx-auto p-0 text-start bg-primary">
		<!-- place footer here -->
	</footer>
	<!-- Bootstrap JavaScript Libraries -->
	<script
		src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
		integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
		crossorigin="anonymous"></script>

	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
		integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
		crossorigin="anonymous"></script>
</body>

</html>