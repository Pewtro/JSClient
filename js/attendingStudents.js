$(document).ready(() => {

    $("#logoutButton").click(() => {
        console.log("davs");
        SDK.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                sessionStorage.removeItem("Student");
                sessionStorage.removeItem("token");
            }
        });
    });

    const $studentTable = $("#studentTable");

    SDK.Event.loadAllAttendingStudents("eventId", (call, students) => {
        students = JSON.parse(students);
        students.forEach((student) => {
            const eventHtml = `
                     <tr>
                     
                      <td>${student.firstName}</td>
                      
                      <td>${student.lastName}</td>
                      
                      </tr>
                      `;

            $studentTable.append(eventHtml)

        });
    });
});