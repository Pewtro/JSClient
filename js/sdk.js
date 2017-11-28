const debug = false;

const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {


        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
            success: (data, status, xhr) => {
                callback(null, SDK.Encryption.decrypt(data), status, xhr);
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
                    sessionStorage.setItem("token", JSON.parse(data));
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
                callback(null, student);
                sessionStorage.setItem("Student", student);

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
                if (err) {
                    return callback(err);
                }
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

        updateEvent: (price, eventName, description, eventDate, location, idEvent, callback) => {
            SDK.request({
                method: "PUT",
                data: {
                    price: price,
                    eventName: eventName,
                    description: description,
                    eventDate: eventDate,
                    location: location,
                    idEvent: idEvent,
                },
                url: "/events/" + idEvent + "/update-event",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        deleteEvent: (idEvent, callback) => {
            SDK.request({
                method: "PUT",
                data: {
                    idEvent: idEvent,
                },
                url: "/events/" + idEvent + "/delete-event",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        joinEvent: (idEvent, callback) => {
            SDK.request({
                method: "POST",
                data: {
                    idEvent: idEvent,
                },
                url: "/events/join",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
            }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        },

        leaveEvent: (idEvent, callback) => {
            SDK.request({
                method: "DELETE",
                data: {
                    idEvent: idEvent,
                },
                url: "/events/" + idEvent + "/leave",
                headers: {
                    authorization: sessionStorage.getItem("token"),
                },
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
    Encryption: {
        encrypt: (encrypt) => {
            if (encrypt !== undefined && encrypt.length !== 0) {
                const fields = ['J', 'M', 'F'];
                let encrypted = '';
                for (let i = 0; i < encrypt.length; i++) {
                    encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return encrypted;
            } else {
                return encrypt;
            }
        },
        decrypt: (decrypt) => {
            if (decrypt.length > 0 && decrypt !== undefined) {
                const fields = ['J', 'M', 'F'];
                let decrypted = '';
                for (let i = 0; i < decrypt.length; i++) {
                    decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (fields[i % fields.length]).charCodeAt(0)))
                }
                return decrypted;
            } else {
                return decrypt;
            }
        }
    },
};