$(document).ready(() => {

    const debug = false;

    $("#logoutButton").click(() => {
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
    const fields = ['price', 'eventName', 'description', 'eventDate', 'location'];

    //made with inspiration from https://stackoverflow.com/a/6178341
    function validateDate(dateString) {
        // Checks the string if it is in the required pattern - regex made and tested here: https://regex101.com/r/pqg4Tx/1/tests
        // image added in /images/ folder showcasing the test
        if (!/^\d{1,2}\/\d{1,2}\/(?:\d{4}|\d{2})$/.test(dateString)) {
            return false;
        }
        // Parse the date parts to integers
        let parts = dateString.split("/");
        debug && console.log("parts: ", parts);
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);
        debug && console.log("day: ", day);
        debug && console.log("month: ", month);
        debug && console.log("year: ", year);

        //we get the current year to use for checks later
        let currentYear = new Date().getFullYear();

        //we check the length of the year as it can be either a 2 or 4 digit number
        if (year.length === 4) {
            //checks if the entered year is over 3000 or less than the currentYear in which case we return false as we cannot create an event in the past
            if (year > 3000 || year < currentYear) {
                return false;
            }
        } else {
            //We can now expect the year to be a 2 digit number
            //Because the currentYear is a 4 digit number, we turn it into a 2 digit number using the slice() method after parsing it as a string.
            //we check if the entered year is less than the currentYear as we cannot create events in the past
            if (year < currentYear.toString().slice(-2)) {
                return false;
            }
        }

        //we check if the entered month is between 1 and 12
        if (month === 0 || month > 12) {
            return false;
        }
        //we define the various month lengths
        let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // We adjust february for leap years, as defined according to the gregorian calendar
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }
        //if the date entered is in the current year, we run checks to ensure it's not in the past.
        if (year === currentYear || year === currentYear.toString().slice(-2)) {
            let currentMonth = new Date().getMonth() + 1;
            if (month < currentMonth) {
                return false;
            } else if (month === currentMonth) {
                let daysDate = new Date().getDate();
                if (day < daysDate) {
                    return false;
                }
            }
        }
        // Check that the entered day is accurate and fits in the scope of the given month
        return day > 0 && day <= monthLength[month - 1];
    }

    //used in validateDetails below
    function isEmpty(str) {
        return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }

    function validateDetails(array, keys) {
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
    }


    $("#addEventButton").click(() => {
        let details = [
            {
                price: $("#newPrice").val(),
                eventName: $("#newEventName").val(),
                location: $("#newLocation").val(),
                description: $("#newDescription").val(),
                eventDate: $("#newDate").val(),
            },
        ];

        if (!validateDetails(details, fields)) {
            alert("You didn't fill out the necessary fields")
        } else if (!validateDate(details[0].eventDate)) {
            alert("Please use one of the following date formats: \n" +
                "one or two digits for days.\n" +
                "one or two digits for months.\n" +
                "four digits for year.\n" +
                "Remember to make sure your date is in the future, and not in the past.")
        } else {
            SDK.Event.createEvent(details[0].price, details[0].eventName, details[0].location, details[0].description, details[0].eventDate, (err, data) => {
                if (err && err.xhr.status === 400) {
                    $(".form-group").addClass("Client fail");
                }
                else if (err) {
                    console.log("Error")
                } else {
                    window.alert("Event with the name " + details[0].eventName + " has been made");
                    let oneMoreEvent = confirm("Do you want to create another event?\nOk to create another, Cancel to go back to profile page.");
                    if (oneMoreEvent) {
                        $("#newPrice").val('');
                        $("#newEventName").val('');
                        $("#newLocation").val('');
                        $("#newDescription").val('');
                        $("#newDate").val('');
                    } else {
                        window.location.href = "profile.html"
                    }
                }
            });
        }
    });
});