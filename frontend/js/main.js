// const HOME_PAGE = "http://localhost:8008";
const HOME_PAGE = "https://enigmatic-coast-66167.herokuapp.com";

function getCurrentUserId() {
    var tokenData = localStorage.getItem('tokenData');
    var jsonInside = JSON.parse(tokenData);
    return jsonInside.id;
}

function getRandomWarningImage() {
    var pictures = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
        '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg', '39.jpg', '40.jpg',
        '41.jpg', '42.jpg', '43.jpg'];
    var path = 'images/animals/sad/';
    return getRandomImage(path, pictures)
}

function getRandomSuccessImage() {
    var pictures = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
        '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg'];
    var path = 'images/animals/happy/';
    return getRandomImage(path, pictures)
}

function getRandomImage(path, array) {
    var randomNumber = Math.floor(Math.random() * array.length);
    var randomImage = array[randomNumber];
    var pathToRandomImage = '' + path + randomImage;
    console.log(pathToRandomImage);
    return pathToRandomImage;

}

function showWarningModal(text) {
    document.getElementById("smallModalTitle").innerHTML = ' <img class="img-responsive" style="margin:0 auto;" src="' +
        getRandomWarningImage() + '" alt="">\n';
    document.getElementById("smallModalBody").innerHTML = text;
    $('#smallModal').modal('show');
}

function showSuccessModal(text) {
    document.getElementById("smallModalTitle").innerHTML = ' <img class="img-responsive" style="margin:0 auto;" src="' +
        getRandomSuccessImage() + '" alt="">\n';
    document.getElementById("smallModalBody").innerHTML = text;
    $('#smallModal').modal('show');
}

function validateField(field, warningText) {
    if (field == null || field == "") {
        showWarningModal(warningText);
        return false;
    }
    return true;
}

function validateYear(year, warningText) {
    if (year == null || year == "") {
        return true;
    }
    if (isNaN(year)) {
        showWarningModal('Year should be a number');
        return false;
    }
    if (year < 1800 || year > new Date().getFullYear()) {
        showWarningModal(warningText);
        return false;
    }
    return true;
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

function selectMenu(menuToSelect, titleText) {
    var titleElement = document.getElementById("accordion_header");
    titleElement.innerHTML = titleText;

    var selected = document.getElementsByClassName("active-page");
    if (selected.length > 0) {
        selected[0].className = selected[0].className.replace("active-page", "");
    }

    var toSelect = document.getElementById(menuToSelect);
    toSelect.className += " active-page";
    return false;
}

function addClassToElement(elementId, classToAdd) {
    var elementOnPage = document.getElementById(elementId);
    elementOnPage.className += classToAdd;
}

function removeClassFromElement(elementId, classToRemove) {
    var selected = document.getElementsByClassName(classToRemove);
    var elementToRemoveClassFrom = document.getElementById(elementId);
    if (selected.length > 0 && selected[0] == elementToRemoveClassFrom) {
        selected[0].className = selected[0].className.replace(classToRemove, "");
    }
}

function changeElementClass(elementId, classToRemove, classToAdd) {
    var element = document.getElementById(elementId);
    if (element.classList.contains(classToRemove)) {
        element.classList.remove(classToRemove);
    }
    element.classList.add(classToAdd);
}

function notNull(str) {
    if (str === null || str === "0") {
        return '';
    }
    return str;
}


