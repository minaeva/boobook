const HOME_PAGE = "http://localhost:8008";
const MESSAGE_SERVICE_HOME = 'http://localhost:8010';
// const HOME_PAGE = "https://enigmatic-coast-66167.herokuapp.com";
// const MESSAGE_SERVICE_HOME = 'https://boobook-messages.herokuapp.com';

const MESSAGE_CONTROLLER = MESSAGE_SERVICE_HOME + '/messages';
const BEARER = 'Bearer ';

function getCurrentUserId() {
    let tokenData = localStorage.getItem('tokenData');
    let jsonInside = JSON.parse(tokenData);
    return jsonInside.id;
}

function getRandomWarningImage() {
    let pictures = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
        '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg', '39.jpg', '40.jpg',
        '41.jpg', '42.jpg', '43.jpg'];
    let path = 'images/animals/sad/';
    return getRandomImage(path, pictures)
}

function getRandomSuccessImage() {
    let pictures = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
        '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg'];
    let path = 'images/animals/happy/';
    return getRandomImage(path, pictures)
}

function getRandomImage(path, array) {
    let randomNumber = Math.floor(Math.random() * array.length);
    let randomImage = array[randomNumber];
    let pathToRandomImage = '' + path + randomImage;
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

function getTokenFromLocalStorage() {
    let localStorageInfo = localStorage.getItem('tokenData');
    let jsonInsideLocalStorage = JSON.parse(localStorageInfo);
    let tokenString = jsonInsideLocalStorage.jwt;
    return tokenString;
}

function addAuthorization(xhr) {
    let tokenString = getTokenFromLocalStorage();
    xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString);
    xhr.setRequestHeader('Accept', 'application/json');
}

function logout() {
    clearRequestHeader();
    window.location.href = 'index.html';
    return false;
}

function clearRequestHeader() {
    localStorage.clear();
    let myHeaders = new Headers();
    myHeaders.delete('Authorization');
    return false;
}

function selectMenu(menuToSelect) {
    deselectActiveMenu();
    addClassToElement(menuToSelect, "active-page");

    return false;
}

function deselectActiveMenu() {
    let selected = document.getElementsByClassName("active-page");
    if (selected.length > 0) {
        selected[0].className = selected[0].className.replace("active-page", "");
    }
}

function addClassToElement(elementId, classToAdd) {
    let elementOnPage = document.getElementById(elementId);
    elementOnPage.classList.add(classToAdd);
}

function removeClassFromElement(elementId, classToRemove) {
    let elementToRemoveClassFrom = document.getElementById(elementId);
    if (elementToRemoveClassFrom.classList.contains(classToRemove)) {
        elementToRemoveClassFrom.classList.remove(classToRemove);
    }
}

function changeElementClass(elementId, classToRemove, classToAdd) {
    let element = document.getElementById(elementId);
    if (element.classList.contains(classToRemove)) {
        element.classList.remove(classToRemove);
    }
    element.classList.add(classToAdd);
}

function notNull(str) {
    if (str === null || str === "0" || str === '' || str === 0) {
        return '';
    }
    return str;
}

function setPageTitle(text) {
    document.getElementById("accordion_header").innerHTML = text;
}

function setPageSubtitle(text) {
    document.getElementById("accordion_subheader").innerHTML = text;
}

function clearContent() {
    document.getElementById("accordion").innerHTML = '';
}



