const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

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
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
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
                SDK.Storage.persist("token", data);
                callback(null, data);
            });
    },

    loadCurrentUser: (cb) => {
        SDK.request({
            method: "GET",
            url: "/students/profile",
            headers: {
                authorization: SDK.Storage.load("token"),
            },
        }, (err, user) => {
            if (err) {
                return cb(err);
            }
            SDK.Storage.persist("User", user);
            cb(null, user);
        });
    },

    currentUser: () => {
        const loadedUser = SDK.Storage.load("User");
        return loadedUser.currentUser();
    },

    logOut: (studentId, cb) => {
        SDK.request({
            method: "POST",
            url: "/students/logout",
            data: studentId,
        }, (err, data) => {
            if (err) {
                return cb(err);
            }

            cb(null, data);
        });
    },

    Storage: {
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
    }
};