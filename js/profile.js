$(document).ready(() => {

    const welcomeHeader = $("#welcomeHeader");
    const parsedStudent = JSON.parse(sessionStorage.getItem("Student"));
    const firstName = parsedStudent.firstName;
    const lastName = parsedStudent.lastName;

    welcomeHeader.append(firstName + " " + lastName + "!");

    const myEventTable = $("#myEventTable");
    SDK.Student.loadAllAttendingEvents((callback, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHTML = `
            <tr>
            <td>${event.idEvent}</td>
            <td>${event.eventName}</td>
            <td>${event.location}</td>
            <td>${event.price}</td>
            <td>${event.eventDate}</td>
            <td>${event.description}</td>
            <td>
                <button data-id="${this}" type="button" id="leaveEvent" class="btn btn-success leave-button" >Leave event
                </button>
            </td>
            </tr>`;

            myEventTable.append(eventHTML);
        });
        $("button").each((id) => {
            $(this).data("id", id);
        });
        $(".leave-button").click(() => {
            console.log($(this).data("id"))
        });
    });
    $("#logoutButton").click(() => {
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