$(document).ready(() => {
    $("#registerButton").click(() => {
        const newFirstName = $("#newFirstName").val();
        const newLastName = $("#newLastName").val();
        const newEmail = $("#newEmail").val();
        const newPassword = $("#newPassword").val();
        const newPasswordVerify = $("#newPasswordVerify").val();

        if (!newFirstName || !newLastName || !newEmail || !newPassword || !newPasswordVerify) {
            document.getElementById("emptyError").innerHTML = "Information missing";
        } else {
            if (newPassword.valueOf() !== newPasswordVerify.valueOf()) {
                $("#newPassword").val('');
                $("#newPasswordVerify").val('');
                document.getElementById("emptyError").innerHTML = "Password doesn't match";
                return;
            }
            SDK.register(newFirstName, newLastName, newEmail, newPassword, newPasswordVerify, (err, data) => {
                if(err && err.xhr.status === 400) {
                    $(".form-group").addClass("Client fail");
                } else if (err) {
                    console.log("Error");
                } else {
                    window.alert(newFirstName + "\t" + "Sign up successful");
                    window.location.href = "login.html"
                }
            });
        }
    });
    $("#goBackButton").click(() => {
        window.location.href = "login.html";
    });
});