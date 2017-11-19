$(document).ready(() => {
    const currentUser = SDK.currentUser();

    $("#logoutButton").click(() => {
        const studentId = currentUser.idStudent;
        SDK.logOut(studentId, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                sessionStorage.remove("User");
                sessionStorage.remove("token");
            }
        });
    });
});