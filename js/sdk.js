const debug = false;

const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {

        let token = {
            "Authorization": SDK.Storage.load("token"),
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

    loadEvents: (callback) => {
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

    loadMyEvents: (callback) => {
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

    //used in validateDetails
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