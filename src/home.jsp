<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="icon" href="images/logo.png" type="image/x-icon">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        /* Add custom styles here */
        .view {
            display: none;
        }

        .active-view {
            display: block;
        }
        .navbar .nav-link.active {
            color: #2D68C4; /* Change to your preferred color */
            text-decoration: underline;
        }
        .scrolling-container {
            display: flex;
            overflow-x: auto;
            white-space: nowrap;
            border: 1px solid #ccc;
            padding: 10px;
            min-height: 75px;
            width: 100%;
        }

        .scrolling-content {
            display: inline-block;
            margin: 10px 20px 10px 20px;
        }
        .logo {
            border-radius: 50%;
        }
        .avatar {
            vertical-align: middle;
            width: 75px;
            height: 75px;
            border-radius: 50%;
        }

    </style>
</head>
<body>
<!-- Navigation Bar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <img src="images/logo.png" width="50" height="50" class="logo me-1"/>
        <a class="navbar-brand" href="#">SongSnap</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item"><button class="btn btn-primary mx-2">Upload SongSnap</button></li>
                <li class="nav-item"><button class="btn btn-primary mx-2">Upload Story</button></li>
                <li class="nav-item"><button class="btn btn-primary mx-2">Upload Prompt</button></li>
                <li class="nav-item">
                    <div class="dropdown mx-2">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Profile
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#">View Profile</a>
                            <a class="dropdown-item" href="#">Settings</a>
                            <a class="dropdown-item" href="#"></a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!--Stories Container -->
<div class="container justify-content-center mt-3">
    <div class="d-flex justify-content-start">
        <h3>Stories</h3>
    </div>
    <div class="scrolling-container d-flex justify-content-center">
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 1">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 2">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 3">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 4">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 5">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 6">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 7">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 8">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 9">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 10">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 11">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 12">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 13">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 14">
        </div>
        <div class="scrolling-content">
            <img class="avatar" src="images/logo.png" alt="Image 15">
        </div>
    </div>
</div>

<!--Feed Container -->
<div class="d-flex-1 text-center justify-content-center align-items-center mt-3">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h1>SongSnap</h1>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-6 mb-4 justify-content-center">
            <nav class="navbar navbar-expand-lg navbar-light justify-content-center ">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#main-feed">Main Feed</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#friends-feed">Friends Feed</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>

<div class="container text-start">
    <!-- Main Feed View -->
    <div id="main-feed" class="view active-view">
        <div class="container">
            <h1>Main Feed</h1>
            <!-- Add your main feed content here -->
        </div>
    </div>

    <!-- Friends Feed View -->
    <div id="friends-feed" class="view">
        <div class="container">
            <h1>Friends Feed</h1>
            <!-- Add your friends feed content here -->
        </div>
    </div>
</div>


<!-- Bootstrap JS and jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
<script>
    // JavaScript to handle navigation between views
    $(document).ready(function() {
        $(".nav-link").on("click", function() {
            // Remove the active class from all links
            $(".nav-link").removeClass("active");
            // Add the active class to the clicked link
            $(this).addClass("active");

            // Hide all views
            $(".view").removeClass("active-view");
            // Show the view corresponding to the clicked link
            $($(this).attr("href")).addClass("active-view");
        });
    });
</script>


</body>
</html>

