$(document).ready(() => {

    const welcomeHeader = $("#welcomeHeader");
    const parsedStudent = JSON.parse(sessionStorage.getItem("Student"));
    const firstName = parsedStudent.firstName;
    const lastName = parsedStudent.lastName;

    welcomeHeader.append(firstName + " " + lastName + "!");

    $("#logoutButton").click(() => {
        console.log("davs");
        SDK.Student.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                sessionStorage.removeItem("Student");
                sessionStorage.removeItem("token");
            }
        });
    });

});