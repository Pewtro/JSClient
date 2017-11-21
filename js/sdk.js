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

    login: (email, password, cb) => {
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
                    return cb(err);
                }
                SDK.Storage.persist("token", data);
                console.log("token created on login");
                cb(null, data);
            });
    },

    loadCurrentUser: (cb) => {
        console.log("Token i SDK.Storage er: ", SDK.Storage.load("token"));
        SDK.request({
            method: "GET",
            url: "/students/profile",
            headers: {
                authorization: SDK.Storage.load("token"),
            },
    }, (err, user) => {
            if (err) {
                console.log("error i loadCurrentUser");
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

    logOut: (idStudent, cb) => {
        SDK.request({
            method: "POST",
            url: "/students/logout",
            data: idStudent,
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