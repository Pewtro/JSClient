$(document).ready(() => {

    $("#logoutButton").click(() => {
        console.log("davs");
        SDK.logOut((err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                SDK.Storage.remove("User");
                SDK.Storage.remove("token");
            }
        });
    });
    const $eventTable = $("#eventTable");

    SDK.loadEvents((call, events) => {
        events = JSON.parse(events);
        events.forEach((event) => {
            const eventHtml = `
                     <tr>
                     
                      <td>${event.location}</td>
                      
                      <td>${event.price}</td>
                      
                      <td>${event.eventDate}</td>
                      
                      <td>${event.description}</td>
                     
                    
                   <td><button type="button" id="attendEvent" class="btn btn-success attend-button" >Attend event</button></td>
                      </tr>
                      `;

            $eventTable.append(eventHtml)

        });

        $(".attend-button").click(function () {

            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id === eventId);
            window.alert(eventId);
            SDK.Event.addToAttendingEvents(event);


        });

    });

});
})
;