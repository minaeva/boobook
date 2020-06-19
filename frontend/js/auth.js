function validateLoginPassword(reader_login, reader_password) {

    if (reader_login == null || reader_login == "") {
        swal({
            title: "Login",
            text: "can't be blank",
            icon: "warning",
            button: "let's fix it",
        });
        return false;
    } else if (reader_password == null || reader_password == "") {
        swal({
            title: "Password",
            text: "can't be blank",
            icon: "warning",
            button: "let's fix it",
        });
        return false;
    }
    return true;
}

function validateName(name) {
    if (name == null || name == "") {
        swal({
            title: "Name",
            text: "can't be blank",
            icon: "warning",
            button: "OK",
        });
        return false;
    }
    return true;
}


function authenticateAReader() {

    var reader_login = document.getElementById("reader_login").value;
    var reader_password = document.getElementById("reader_password").value;

    if (validateLoginPassword(reader_login, reader_password)) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (this.readyState == 4) {
                if (this.status == 404) {
                    swal({
                        title: "Reader with login " + reader_login,
                        text: "is not found",
                        icon: "warning",
                        button: "let's try another",
                    });
                    document.getElementById("reader_login").value = '';
                    document.getElementById("reader_password").value = '';

                    return false;
                }

                if (this.status == 401) {
                    swal({
                        title: "Incorrect password for a reader",
                        text: "with login " + reader_login,
                        icon: "warning",
                        button: "let's try another",
                    });
                    document.getElementById("reader_password").value = '';

                    return false;
                }

                if (this.status == 200) {
                    var token = JSON.parse(this.responseText);
                    localStorage.setItem('tokenData', JSON.stringify(token));
                    window.location.href = 'cabinet.html';
                }
            }
        };

        var requestUrl = HOME_PAGE + "/users/auth";

        const requestBody = {
            "login": reader_login,
            "password": reader_password
        };

        xhr.open("POST", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(requestBody));

        return false;
    }
}


function registerAReader() {

    var new_login = document.getElementById("new_login").value;
    var new_password = document.getElementById("new_password").value;
    var new_name = document.getElementById("new_name").value;
    var new_surname = document.getElementById("new_surname").value;
    var new_email = document.getElementById("new_email").value;
    var new_fb_page = document.getElementById("new_fb_page").value;
    var new_city = document.getElementById("new_city").value;

    if (validateLoginPassword(new_login, new_password) && validateName(new_name)) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (this.readyState == 4) {
                if (this.status == 400) {
                    swal({
                        title: "User with login " + new_login,
                        text: "cannot be created",
                        icon: "warning",
                        button: "let's try another",
                    });
                    document.getElementById("new_login").value = '';
                    document.getElementById("new_password").value = '';
                    document.getElementById("new_name").value = '';
                    document.getElementById("new_surname").value = '';
                    document.getElementById("new_email").value = '';
                    document.getElementById("new_fb_page").value = '';
                    document.getElementById("new_city").value = '';

                    return false;
                } else if (this.status == 200) {
                    swal({
                        title: "User with login " + new_login,
                        text: "was created",
                        type: "success",
                        button: "Time to sign up"
                    }).then(function () {
                        window.location = "index.html";
                    });

                    // swal({
                    //     title: "User with login " + new_login,
                    //     text: "was created",
                    //     icon: "success",
                    //     button: "Time to sign up"
                    // }, function () {
                    //     window.location = 'index.html';
                    // });
                }
            }
        };

        var requestUrl = HOME_PAGE + "/users/register";

        const requestBody = {
            "login": new_login,
            "password": new_password,
            "name": new_name,
            "surname": new_surname,
            "email": new_email,
            "fbPage": new_fb_page,
            "city": new_city,
            "registrationType": 'CUSTOM'
        };

        xhr.open("POST", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(requestBody));

        return false;
    }
}

function registerAFbReader(fullName, email, id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.status == 500) {
            swal({
                title: "Sorry",
                text: "Something is wrong with logging " + fullName,
                icon: "warning",
                button: "let's try once again"
            });
            return false;
        }

        if (this.readyState == 4 && this.status == 200) {
            var token = JSON.parse(this.responseText);
            localStorage.setItem('tokenData', JSON.stringify(token));
        }
    };

    var requestUrl = HOME_PAGE + "/users/register";
    const nameParts = fullName.split(' ');
    const requestBody = {
        "login": id,
        "name": nameParts[0],
        "surname": nameParts[1],
        "email": email,
        "registrationType": 'FB'
    };

    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(requestBody));

    return false;
}

function setAuthorization() {
    var xhr = new XMLHttpRequest();
    addAuthorization(xhr);
}

function addAuthorization(xhr) {
    var localStorageInfo = localStorage.getItem('tokenData');
    var jsonInsideLocalStorage = JSON.parse(localStorageInfo);
    var tokenString = jsonInsideLocalStorage.token;
    xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString);
    xhr.setRequestHeader('Accept', 'application/json');
}

function logout() {
    clearHeader();
    window.location.href = 'index.html';
    return false;
}

function clearHeader() {
    localStorage.clear();
    var myHeaders = new Headers();
    myHeaders.delete('Authorization');
    return false;
}