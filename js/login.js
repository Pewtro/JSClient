$(document).ready(() => {
    $("#loginButton").click(() => {

        let email = $("#emailInput").val();
        let password = $("#passwordInput").val();

        if (!email || !password) {
            document.getElementById("error").innerHTML = "Information missing";
        } else {
            SDK.Student.login(email, password, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "Wrong email or password";
                } else if (err) {
                    console.log("Error");
                } else if (sessionStorage.getItem('token') === null) {
                    $("#passwordInput").val('');
                    document.getElementById("error").innerHTML = "No user found";
                } else {
                    SDK.Student.loadCurrentStudent((err, data) => {
                        if (err && err.xhr.status === 401) {
                            $(".form-group").addClass("Client fail");
                            document.getElementById("error").innerHTML = "Wrong username or password";
                        } else if (err && err.xhr.status === 415) {
                            console.log("unsupported media type error");
                        } else if (err) {
                            console.log("general error i loadCurrentUser from login.js");
                        } else {
                            window.location.href = "profile.html";
                        }
                    });
                }
            });
        }

    });

    $("#registerButton").click(() => {
        window.location.href = "register.html";
    });
});