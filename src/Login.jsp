<%@ page import="java.sql.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
            integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js"
            integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous">
    </script>
</head>
<body>
<div class="d-flex justify-content-center my-5">
    <h1>Welcome to SongSnap</h1>
</div>
<!-- Pills navs -->
<div class="row">
    <div class="col-md-3 d-none d-md-block"></div>
    <div class="col-md-6 col-12">

        <div class="tab-content">
            <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <form>
                    <div class="text-center mb-3">
                        <h4>Please Sign In</h4>
                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <div class="d-flex justify-content-start">
                                <label class="form-label" for="loginName">Username</label>
                            </div>
                            <input type="email" id="loginName" class="form-control"/>
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-4">
                            <div class="d-flex justify-content-start">
                                <label class="form-label" for="loginPassword">Password</label>
                            </div>
                            <input type="password" id="loginPassword" class="form-control"/>
                        </div>

                        <!-- Submit button -->
                        <div class="d-flex justify-content-center align-items-center">
                            <button type="submit" class="btn btn-outline-primary btn-block mb-4">Sign in</button>
                        </div>
                        <!-- Register buttons -->
                        <div class="text-center">
                            <p>Not a member? <a href="Registration.jsp" style="text-decoration: none">Register</a></p>
                        </div>
                    </div>
                </form>
            </div>

            </form>
        </div>
    </div>
</div>
</div>
</body>
</html>
