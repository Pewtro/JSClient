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

    const myEventTable = $("#myEventTable");

    SDK.Event.loadAllMyEvents((call, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventList = `
                     <tr>
                
                     <td>${event.idEvent}</td>
                     <td>${event.eventName}</td>
                     <td>${event.location}</td>
                     <td>${event.price}</td>
                     <td>${event.eventDate}</td>
                     <td>${event.description}</td>
                    
                   <td><button type="button" id="attendEvent" class="btn btn-success update-button" >Update event</button></td>
                   <td><button type="button" id="attendEvent" class="btn btn-success delete-button" >Delete event</button></td>
                   <td><button type="button" id="attendingStudents" class="btn btn-success viewAttending-button" >View attending students</button></td>
                      </tr>
                      `;

            myEventTable.append(eventList)

        });

        $(".update-button").click(() => {
            const eventId = $(this).data("event-id");
            sessionStorage.setItem("eventId", eventId);

            window.location.href = "updateEvent.html";
        });

        $(".delete-button").click(() => {
            sessionStorage.setItem("eventId", eventId);
            let confirmDelete = confirm("Are you sure you want to delete the event: " + eventName + "?");
            if (confirmDelete) {
                SDK.Event.deleteEvent(event);
            }
        });
        $(".viewAttending-button").click(function () {

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(event);
            SDK.Event.loadAllAttendingStudents(eventId);
        });
    });
});