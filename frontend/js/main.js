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

function loadIndex() {
    clearRequestHeader();
    resetLanguageOnIndex();
}

function clearRequestHeader() {
    let savedLanguage = localStorage.getItem('language');
    localStorage.clear();
    localStorage.setItem('language', savedLanguage);

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

function genderToString(gender) {
    if (gender == 1) {
        return 'female';
    }
    if (gender == 2) {
        return 'male';
    }
    return '';
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

function setRussianLanguage() {
    localStorage.setItem('language', 'ru');
    $('#selected_app_language').text('RU');

    $('#app_language_text_1').text('UA');
    $("#app_language_link_1").attr("onclick", "setUkrainianLanguage()");
    $('#app_language_text_2').text('EN');
    $("#app_language_link_2").attr("onclick", "setEnglishLanguage()");

    application_language = ru;
    resetLanguage();
    return false;
}

function setUkrainianLanguage() {
    localStorage.setItem('language', 'ua');
    $('#selected_app_language').text('UA');

    $('#app_language_text_1').text('EN');
    $("#app_language_link_1").attr("onclick", "setEnglishLanguage()");
    $('#app_language_text_2').text('RU');
    $("#app_language_link_2").attr("onclick", "setRussianLanguage()");

    application_language = ua;
    resetLanguage();
    return false;
}

function setEnglishLanguage() {
    localStorage.setItem('language', 'en');
    $('#selected_app_language').text('EN');
    $('#app_language_text_1').text('RU');
    $("#app_language_link_1").attr("onclick", "setRussianLanguage()");
    $('#app_language_text_2').text('UA');
    $("#app_language_link_2").attr("onclick", "setUkrainianLanguage()");

    application_language = en;
    resetLanguage();
    return false;
}

function getLanguageFromLocalStorage() {
    let savedLanguage = localStorage.getItem('language');
    if (savedLanguage == null || savedLanguage == 'en') {
        application_language = en;
    } else if (savedLanguage == 'ru') {
        application_language = ru;
    } else if (savedLanguage == 'ua') {
        application_language = ua;
    }
}


function resetLanguage() {
    getLanguageFromLocalStorage();

    $('#menu_add_book_title').text(application_language.menu_add_book_title);
    $('#menu_my_books_title').text(application_language.menu_my_books_title);
    $('#menu_books_title').text(application_language.menu_books_title);
    $('#menu_readers_title').text(application_language.menu_readers_title);
    $('#menu_favorite_title').text(application_language.menu_favorite_title);
    $('#menu_favorite_readers_title').text(application_language.menu_favorite_readers_title);
    $('#logo_title').text(application_language.logo_title);
    $('#register_page_title').text(application_language.register_page_title);
    $('#cabinet_page_title').text(application_language.cabinet_page_title);

    $('#chat_title').text(application_language.chat_title);
    $('#profile_title').text(application_language.profile_title);
    $('#logout_title').text(application_language.logout_title);
    $('#recent_title').text(application_language.recent_title);
    $('#add_book_title').text(application_language.add_book_title);
    $('#book_title_title').text(application_language.book_title_title);
    $('#author_name_title').text(application_language.author_name_title);
    $('#author_surname_title').text(application_language.author_surname_title);
    $('#publisher_title').text(application_language.publisher_title);
    $('#year_title').text(application_language.year_title);
    $('#pages_quantity_title').text(application_language.pages_quantity_title);

    $('#language_title').text(application_language.language_title);
    $('#language_select_title').text(application_language.language_select_title);
    $('#language_rus_title').text(application_language.language_rus_title);
    $('#language_ukr_title').text(application_language.language_ukr_title);
    $('#language_eng_title').text(application_language.language_eng_title);
    $('#language_oth_title').text(application_language.language_oth_title);

    $('#cover_title').text(application_language.cover_title);
    $('#select_cover_title').text(application_language.select_cover_title);
    $('#select_hard_title').text(application_language.select_hard_title);
    $('#select_soft_title').text(application_language.select_soft_title);

    $('#illustrations_title').text(application_language.illustrations_title);
    $('#select_illustrations_title').text(application_language.select_illustrations_title);
    $('#select_illustrations_no_title').text(application_language.select_illustrations_no_title);
    $('#select_illustrations_bw_title').text(application_language.select_illustrations_bw_title);
    $('#select_illustrations_color_title').text(application_language.select_illustrations_color_title);

    $('#age_group_title').text(application_language.age_group_title);
    $('#select_age_title').text(application_language.select_age_title);
    $('#select_age_baby_title').text(application_language.select_age_baby_title);
    $('#select_age_preschool_title').text(application_language.select_age_preschool_title);
    $('#select_age_junior_title').text(application_language.select_age_junior_title);
    $('#select_age_midschool_title').text(application_language.select_age_midschool_title);
    $('#select_age_adult_title').text(application_language.select_age_adult_title);

}


function resetLanguageOnIndex() {
    getLanguageFromLocalStorage();

    $('#login_page_title').text(application_language.login_page_title);
    $('#login_login_form_title').text(application_language.login_login_form_title);
    $('#login_email_title').text(application_language.login_email_title);
    $('#login_password_title').text(application_language.login_password_title);
    $('#login_register_button_title').text(application_language.login_register_button_title);
    $('#login_login_button_title').text(application_language.login_login_button_title);

}

function resetLanguageOnRegister() {
    getLanguageFromLocalStorage();

    $('#register_page_title').text(application_language.register_page_title);
    $('#register_form_title').text(application_language.register_form_title);
    $('#register_name_title').text(application_language.register_name_title);
    $('#register_email_title').text(application_language.register_email_title);
    $('#register_password_title').text(application_language.register_password_title);
    $('#register_register_button_title').text(application_language.register_register_button_title);
    $('#register_login_button_title').text(application_language.register_login_button_title);
    $('#register_close_title').text(application_language.register_close_title);

}