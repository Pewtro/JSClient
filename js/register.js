$(document).ready(() => {
    const debug = false;

    const fields = ['newFirstName', 'newLastName', 'newEmail', 'newPassword', 'newPasswordVerify'];

    $("#registerButton").click(() => {
        let details = [
            {
                newEmail: $("#newEmail").val(),
                newFirstName: $("#newFirstName").val(),
                newLastName: $("#newLastName").val(),
                newPassword: $("#newPassword").val(),
                newPasswordVerify: $("#newPasswordVerify").val(),
            },
        ];

        debug && console.log("validateDetails result: ", SDK.validateDetails(details, fields));

        if (!SDK.Other.validateDetails(details, fields)) {
            document.getElementById("emptyError").innerHTML = "Information missing";
        } else {
            if (details[0].newPassword.valueOf() !== details[0].newPasswordVerify.valueOf()) {
                $("#newPassword").val('');
                $("#newPasswordVerify").val('');
                document.getElementById("emptyError").innerHTML = "Passwords don't match";
                return;
            }
            SDK.Student.register(details[0].newFirstName, details[0].newLastName, details[0].newEmail, details[0].newPassword, details[0].newPasswordVerify, (err, data) => {
                if (err && err.xhr.status === 400) {
                    $(".form-group").addClass("Client fail");
                } else if (err) {
                    console.log("Error");
                } else {
                    window.alert(details[0].newFirstName + " has been registered successfully");
                    window.location.href = "login.html"
                }
            });
        }
    });
    $("#goBackButton").click(() => {
        window.location.href = "login.html";
    });
});