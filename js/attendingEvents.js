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

    SDK.Event.loadAllAttendingEvents(SDK.currentUser().idStudent, (call, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHtml = `
                     <tr>
                     
                      <td>${event.location}</td>
                      
                      <td>${event.price}</td>
                      
                      <td>${event.eventDate}</td>
                      
                      <td>${event.description}</td>
                     
                    
                   <td><button type="button" id="leaveEvent" class="btn btn-success leave-button" >Attend event</button></td>
                      </tr>
                      `;

            $eventTable.append(eventHtml)

        });

        $(".leave-button").click(function () {

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(eventId);
            //should probably be eventId
            SDK.Event.leaveEvent(event, SDK.currentUser().idStudent);
        });
    });
});