const debug = false;

const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {

        let token = {
            "Authorization": sessionStorage.getItem("token"),
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
        });

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
                    console.log("token created on login");
                    callback(null, data);
                });
        },

        loadCurrentUser: (callback) => {
            console.log("Token i sessionStorage er: ", sessionStorage.getItem("token"));
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
                sessionStorage.setItem("Student", student);
                callback(null, student);
            });
        },

        currentUser: () => {
            const loadedUser = sessionStorage.getItem("Student");
            return loadedUser.currentUser;
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
        loadAllAttendingEvents: (idStudent, callback) => {
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
        createEvent: (price, eventName, description, eventDate, location, callback) => {
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
        loadAllMyEvents: (idStudent, callback) => {
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

    Other: {
        //used in validateDetails below
        isEmpty(str) {
            return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
        },

        //used in register.js and newEvent.js
        validateDetails(array, keys) {
            let errors = 0;
            debug && console.log("array i validateDetails: ", array);
            debug && console.log("keys i validateDetails: ", keys);
            keys.forEach(function (k) {
                if (k in array[0]) {
                    if (isEmpty(array[0][k])) {
                        console.log(k, "is empty");
                        errors += 1;
                    }
                } else {
                    console.log(k, "doesn't exist");
                }
            });
            return errors <= 0;
        },
    },


    // TODO: REMOVE
    //saving for now - should be safe to remove tho.
    /*    Storage: {
            prefix: "DøkSocialSDK",
            persist: (key, value) => {
                window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
            },
            load: (key) => {
                const val = window.localStorage.getItem(SDK.Storage.prefix + key);
                try {
                    return JSON.parse(val);
                }
                catch (e) {
                    return val;
                }
            },
            remove: (key) => {
                window.localStorage.removeItem(SDK.Storage.prefix + key);
            }
        },*/

};