$(document).ready(() => {
    $("#loginButton").click(() => {

        let email = $("#emailInput").val();
        let password = $("#passwordInput").val();

        if (!email || !password) {
            document.getElementById("error").innerHTML = "Information missing";
        } else {
            SDK.login(email, password, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "Wrong email or password";
                }
/*                else if (err && err.xhr.status === 400) {
                    console.log("Already logged in");
                } */
                else if (err) {
                    console.log("Error");
                } else if (SDK.Storage.load('token') === null) {
                    $("#passwordInput").val('');
                    document.getElementById("error").innerHTML = "No user found";
                } else {
                    console.log("there is something in token value, attempting to loadCurrentUser");
                    console.log(data);
                    SDK.loadCurrentUser((err, data) => {
                        if (err && err.xhr.status === 401) {
                            $(".form-group").addClass("Client fail");
                            document.getElementById("error").innerHTML = "Wrong username or password";
                        } else if(err && err.xhr.status === 415) {
                            console.log("unsupported media type error");
                        } else if(err) {
                            console.log("general error i loadCurrentUser from login.js");
                        } else {
                            const myStudent = JSON.parse(data);
                            const currentStudent = myStudent.currentUser;
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