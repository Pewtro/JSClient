$(document).ready(() => {

    $("#logoutButton").click(() => {
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
            const studentsHTML = `
                     <tr>
                     <td>${student.idStudent}</td>
                      <td>${student.firstName}</td>
                      <td>${student.lastName}</td>
                      <td>${student.email}</td>
                      </tr>
                      `;

            $studentTable.append(studentsHTML)

        });
    });

    const attendingEventTable = $("#myEventTable");

    const parsedEvent = JSON.parse(sessionStorage.getItem("Event"));
    const idEvent = parsedEvent.idEvent;
    const eventName = parsedEvent.eventName;
    const location = parsedEvent.location;
    const price = parsedEvent.price;
    const date = parsedEvent.eventDate;
    const description = parsedEvent.description;

    const eventHTML = `
    <tr>
    <td>${idEvent}</td>
    <td>${eventName}</td>
    <td>${location}</td>
    <td>${price}</td>
    <td>${date}</td>
    <td>${description}</td>
    </tr>`;

    attendingEventTable.append(eventHTML);

});