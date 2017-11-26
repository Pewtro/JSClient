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

    const $myEventTable = $("#myEventTable");

    SDK.loadAllMyEvents((call, events) => {
        console.log(events);
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHtml = `
                     <tr>
                     
                      <td>${event.location}</td>
                      
                      <td>${event.price}</td>
                      
                      <td>${event.eventDate}</td>
                      
                      <td>${event.description}</td>
                     
                    <td><button type="button" id="updateEvent" class="btn btn-success update-button" >Update event</button></td>
                   <td><button type="button" id="deleteEvent" class="btn btn-success delete-button" >Delete event</button></td>
                      </tr>
                      `;

            $myEventTable.append(eventHtml)
        });

        $(".update-button").click(function () {
            const eventId = $(this).data("event-id");
            sessionStorage.setItem("eventId", eventId);

            window.location.href = "updateEvent.html";
        });

        $(".delete-button").click(function () {
            sessionStorage.setItem(eventId);
            let confirmDelete = confirm("Are you sure you want to delete the event: " + eventName + "?");
            if (confirmDelete) {
                SDK.Event.deleteEvent(event);
            }
        });
    });
});