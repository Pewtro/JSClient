const debug = false;

const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {


        let token = {
            "authorization": sessionStorage.getItem("token")
        };

        $.ajax({

            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                callback(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        })
    },
    //Everything related to the student
    Student: {
        register: (newFirstName, newLastName, newEmail, newPassword, newVerifyPassword, callback) => {
            SDK.request({
                data: {
                    firstName: newFirstName,
                    lastName: newLastName,
                    email: newEmail,
                    password: newPassword,
                    verifyPassword: newVerifyPassword
                },
                url: "/register",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        login: (email, password, callback) => {
            SDK.request({
                    data: {
                        email: email,
                        password: password
                    },
                    url: "/login",
                    method: "POST"
                },
                (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    sessionStorage.setItem("token", data);
                    callback(null, data);
                });
        },

        loadCurrentStudent: (callback) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, student) => {
                if (err) {
                    console.log("error i loadCurrentUser");
                    return callback(err);
                }
                let parsedStudent = JSON.parse(student);
                sessionStorage.setItem("Student", student);
                console.log(parsedStudent.idStudent);
                callback(null, student);
            });
        },

        logOut: (callback) => {
            SDK.request({
                method: "POST",
                url: "/students/logout",
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },
        //All events the student is attending
        loadAllAttendingEvents: (callback) => {
            let idStudent = JSON.parse(sessionStorage.getItem("Student")).idStudent;
            SDK.request({
                method: "GET",
                url: "/students/" + idStudent + "/events",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, event) => {
                if (err) return callback(err);
                callback(null, event)
            });
        },
    },
    //Everything that has to do with events
    Event: {
        createEvent: (price, eventName, location, description, eventDate, callback) => {
            SDK.request({
                data: {
                    price: price,
                    eventName: eventName,
                    location: location,
                    description: description,
                    eventDate: eventDate
                },
                url: "/events",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        updateEvent: (price, eventName, description, eventDate, location, callback) => {
            SDK.request({
                data: {
                    price: price,
                    eventName: eventName,
                    description: description,
                    eventDate: eventDate,
                    location: location
                },
                url: "/events",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        deleteEvent: (idEvent, callback) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                },
                url: "/events/" + idEvent + "delete-event",
                method: "PUT"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        joinEvent: (idEvent, idStudent, callback) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    idStudent: idStudent,
                },
                url: "/events/join",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        leaveEvent: (idEvent, idStudent, callback) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    idStudent: idStudent,
                },
                url: "/events/join",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },
        //Loads all events
        loadAllEvents: (callback) => {
            SDK.request({
                method: "GET",
                url: "/events",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, event) => {
                if (err) return callback(err);
                callback(null, event)
            });
        },
        //Loads all events created by the student that is logged in
        loadAllMyEvents: (callback) => {
            SDK.request({
                method: "GET",
                url: "/events/myEvents",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, event) => {
                if (err) {
                    return callback(err);
                }
                callback(null, event)
            });
        },
        //All students attending the event
        loadAllAttendingStudents: (idEvent, callback) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, event) => {
                if (err) return callback(err);
                callback(null, event)
            });
        },
    },

};