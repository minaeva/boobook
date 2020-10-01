function authenticateAReader(email, password) {
    if (!validateExistentReader(email, password)) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                showWarningModal("Reader with email " + email + " is not found");
                document.getElementById("reader_email").value = '';
                document.getElementById("reader_password").value = '';
                return false;
            }
            if (this.status == 401) {
                showWarningModal("Incorrect password for a reader with email " + email);
                document.getElementById("reader_password").value = '';
                return false;
            }
            if (this.status == 200) {
                let token = JSON.parse(this.responseText);
                localStorage.setItem('tokenData', JSON.stringify(token));
                window.location.href = 'cabinet.html';
            }
        }
    };

    let requestUrl = HOME_PAGE + "/users/auth";
    const requestBody = {
        "email": email,
        "password": password
    };
    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(requestBody));

    return false;

}

function registerAReader() {
    let new_email = document.getElementById("new_email").value;
    let new_password = document.getElementById("new_password").value;
    let new_name = document.getElementById("new_name").value;

    if (!validateNewReader(new_name, new_email, new_password)) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 400) {
                showWarningModal("User with email " + new_email + " cannot be created");
                document.getElementById("new_email").value = '';
                document.getElementById("new_password").value = '';
                document.getElementById("new_name").value = '';
                return false;
            } else if (this.status == 200) {
                showSuccessModal("User with email " + new_email + " was created");
                authenticateAReader(new_email, new_password);
            }
        }
    };

    let requestUrl = HOME_PAGE + "/users/register";
    const requestBody = {
        "email": new_email,
        "password": new_password,
        "name": new_name,
        "registrationType": 'CUSTOM'
    };
    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(requestBody));

    return false;
}

function registerAFbReader(fullName, email, id) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState == 4) {
            if ((this.status == 500) || (this.status = 400)) {
                showWarningModal("Something is wrong with logging " + fullName);
                return false;
            } else if (this.status == 200) {
                let token = JSON.parse(this.responseText);
                localStorage.setItem('tokenData', JSON.stringify(token));
            }
        }
    };

    let requestUrl = HOME_PAGE + "/users/register";
    const nameParts = fullName.split(' ');
    const requestBody = {
        "email": id,
        "name": nameParts[0],
        "surname": nameParts[1],
        "registrationType": 'FB'
    };
    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(requestBody));

    return false;
}
