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
    const $eventTable = $("#eventTable");

    SDK.loadAllEvents((call, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHtml = `
                     <tr>
                     
                      <td>${event.location}</td>
                      
                      <td>${event.price}</td>
                      
                      <td>${event.eventDate}</td>
                      
                      <td>${event.description}</td>
                     
                    
                   <td><button type="button" id="attendEvent" class="btn btn-success attend-button" >Attend event</button></td>
                   <td><button type="button" id="attendingStudents" class="btn btn-success viewAttending-button" >View attending students</button></td>
                      </tr>
                      `;

            $eventTable.append(eventHtml)

        });

        $(".attend-button").click(function () {

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(eventId);
            SDK.Event.joinEvent(event);
        });
        $(".viewAttending-button").click(function () {

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(event);
            SDK.Event.loadAllAttendingStudents(eventId);
        });
    });
});
