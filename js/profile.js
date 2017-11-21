$(document).ready(() => {


    $("#logoutButton").click(() => {
        console.log("davs");
        SDK.logOut(idStudent, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                SDK.Storage.remove("User");
                SDK.Storage.remove("token");
            }
        });
    });
});