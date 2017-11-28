$(document).ready(() => {

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
    const myEventTable = $("#myEventTable");

    SDK.Event.loadAllEvents((callback, data) => {
        if (callback) {
            throw callback;
        }
        let events = JSON.parse(data);
        $.each(events, function (i, callback) {
            let tr = '<tr>';
            tr += '<td>' + events[i].idEvent + '</td>';
            tr += '<td>' + events[i].eventName + '</td>';
            tr += '<td>' + events[i].location + '</td>';
            tr += '<td>' + events[i].price + '</td>';
            tr += '<td>' + events[i].eventDate + '</td>';
            tr += '<td>' + events[i].description + '</td>';
            tr += '<td><button id="attendButton" class="btn btn-success attend-button" data-id="' + (i + 1) + '">Attend event</button></td>';
            tr += '<td><button id="attendingStudents" class="btn btn-success viewAttending-button" data-id="' + (i + 1) + '">View attending</button></td>';
            i += 1;
            myEventTable.append(tr);
        });
        $(".attend-button").on('click', function () {
            if (confirm("are you sure you want to join this event?\n" +
                    "You can always leave the event again.")) {
                let name = $(this).closest("tr").find("td:eq(1)").text();
                for (let i = 0; i < events.length; i++) {
                    if (name === events[i].eventName) {
                        SDK.Event.joinEvent(events[i].idEvent, (err, data) => {
                            if (err) {
                                throw err;
                            } else {
                                alert("You successfully joined the event");
                            }
                        });

                    }
                }
            }
        });
        $(".viewAttending-button").click(function () {
            let name = $(this).closest("tr").find("td:eq(1)").text();
            for (let i = 0; i < events.length; i++) {
                if (name === events[i].eventName) {
                    const myAttendingStudentsEventTable = $("#attendingStudentsEventsOverlay");
                    let tr = '<tr>';
                    tr += '<td>' + events[i].idEvent + '</td>';
                    tr += '<td>' + events[i].eventName + '</td>';
                    tr += '<td>' + events[i].location + '</td>';
                    tr += '<td>' + events[i].price + '</td>';
                    tr += '<td>' + events[i].eventDate + '</td>';
                    tr += '<td>' + events[i].description + '</td>';
                    myAttendingStudentsEventTable.append(tr);
                    SDK.Event.loadAllAttendingStudents(events[i].idEvent, (err, data) => {
                        if(err) {
                            throw err;
                        } else {
                            const myAttendingStudentsTable = $("#attendingStudentsOverlay");
                            let students = JSON.parse(data);
                            $.each(students, function(i, callback) {
                                let tr = '<tr>';
                                tr += '<td>' + students[i].firstName + '</td>';
                                tr += '<td>' + students[i].lastName + '</td>';
                                tr += '<td>' + students[i].email + '</td>';
                                i += 1;
                                myAttendingStudentsTable.append(tr);
                            })
                        }
                    })
                }
            }
            document.getElementById("overlay").style.display = "block";
        });
    });
    $("#turnOffOverlay").click(() => {
        document.getElementById("overlay").style.display = "none";
        $("#attendingStudentsOverlay").empty();
        $("#attendingStudentsEventsOverlay").empty();
    });
});
