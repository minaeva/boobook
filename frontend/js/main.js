const MESSAGE_CONTROLLER = MESSAGE_SERVICE_HOME + '/messages';
const BEARER = 'Bearer ';

function getCurrentUserId() {
    let tokenData = localStorage.getItem('tokenData');
    let jsonInside = JSON.parse(tokenData);
    if (jsonInside == null) {
        return null;
    }
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
//    googleSignOut();
    window.location.href = 'index.html';
    return false;
}

function loadIndex() {
    clearIndexForm();
    clearRequestHeader();
    resetLanguageOnIndex();
    attachAuthListenerOnEnter();
}

function clearIndexForm() {
    $("#reader_email").removeAttr('value');
    $('#reader_password').removeAttr('value');
}

function loadRegister() {
    clearRegisterForm();
    resetLanguageOnRegister();
    attachRegisterListenerOnEnter();
}

function clearRegisterForm() {
    $("#new_email").removeAttr('value');
    $("#new_name").removeAttr('value');
    $("#new_password").removeAttr('value');
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

function isEmpty(str) {
    if (str === null || str === '') {
        return true;
    }
    return false;

}

function genderToString(gender) {
    if (gender == 1) {
        return application_language.profile_gender_female_title;
    }
    if (gender == 2) {
        return application_language.profile_gender_male_title;
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

function initYearPicker() {
    $('.yearpicker').yearpicker({

        // Initial Year
        year: null,
        // new Date().getFullYear(),

        // Start Year
        startYear: 1900,

        // End Year
        endYear: new Date().getFullYear(),

        // Element tag
        itemTag: 'li',

        // Default CSS classes
        selectedClass: 'selected',
        disabledClass: 'disabled',
        hideClass: 'hide',

        // Custom template
        template: `<div class="yearpicker-container">
              <div class="yearpicker-header">
                  <div class="yearpicker-prev" data-view="yearpicker-prev">&lsaquo;</div>
                  <div class="yearpicker-current" data-view="yearpicker-current">SelectedYear</div>
                  <div class="yearpicker-next" data-view="yearpicker-next">&rsaquo;</div>
              </div>
              <div class="yearpicker-body">
                  <ul class="yearpicker-year" data-view="years">
                  </ul>
              </div>
          </div>
  `,
    });

    $('.yearpicker').yearpicker({
        onShow: null,
        onHide: null,
        onChange: null
    });

    $('.yearpicker').keypress(function (e) {
        e.preventDefault();
    });

// // to disable backspace & delete
//     $('.yearpicker').keydown(function (event) {
//             event.preventDefault();
//     });
}


function setRussianLanguage() {
    $('#language_modal').modal('hide');
    localStorage.setItem('language', 'ru');
    application_language = ru;
    setRuLanguageOnUI();
    resetLanguage();
    return false;
}

function setUkrainianLanguage() {
    $('#language_modal').modal('hide');
    localStorage.setItem('language', 'ua');
    application_language = ua;
    setUaLanguageOnUI();
    resetLanguage();
    return false;
}

function setUaLanguageOnUI() {
    $('#selected_app_language').text('UA');
    $('#selected_app_language_top').text('UA');
    $('#app_language_text_1').text('EN');
    $("#app_language_link_1").attr("onclick", "setEnglishLanguage()");
    $('#app_language_text_2').text('RU');
    $("#app_language_link_2").attr("onclick", "setRussianLanguage()");
}

function setRuLanguageOnUI() {
    $('#selected_app_language').text('RU');
    $('#selected_app_language_top').text('RU');
    $('#app_language_text_1').text('UA');
    $("#app_language_link_1").attr("onclick", "setUkrainianLanguage()");
    $('#app_language_text_2').text('EN');
    $("#app_language_link_2").attr("onclick", "setEnglishLanguage()");
}

function setEnglishLanguage() {
    $('#language_modal').modal('hide');
    localStorage.setItem('language', 'en');
    application_language = en;
    setEnLanguageOnUI();
    resetLanguage();
    return false;
}

function setEnLanguageOnUI() {
    $('#selected_app_language').text('EN');
    $('#selected_app_language_top').text('EN');
    $('#app_language_text_1').text('RU');
    $("#app_language_link_1").attr("onclick", "setRussianLanguage()");
    $('#app_language_text_2').text('UA');
    $("#app_language_link_2").attr("onclick", "setUkrainianLanguage()");
}

function getLanguageFromLocalStorage() {
    let savedLanguage = localStorage.getItem('language');
    if (savedLanguage == null || savedLanguage == "null" || savedLanguage == 'en') {
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

    $('#description_title').text(application_language.description_title);
    $('#images_description_title').text(application_language.images_description_title);
    $('#fileButton').text(application_language.fileButton);
    $('#add_book_close_title').text(application_language.add_book_close_title);
    $('#add_book_button_title').text(application_language.add_book_button_title);

    $('#edit_book_modal_title').text(application_language.edit_book_modal_title);
    $('#edit_book_title_title').text(application_language.edit_book_title_title);
    $('#edit_book_active_title').text(application_language.edit_book_active_title);
    $('#edit_book_active_yes').text(application_language.edit_book_active_yes);
    $('#edit_book_active_no').text(application_language.edit_book_active_no);
    $('#edit_book_author_name_title').text(application_language.edit_book_author_name_title);
    $('#edit_book_author_surname_title').text(application_language.edit_book_author_surname_title);
    $('#edit_book_publisher_title').text(application_language.edit_book_publisher_title);
    $('#edit_book_year_title').text(application_language.edit_book_year_title);
    $('#edit_book_pages_quantity_title').text(application_language.edit_book_pages_quantity_title);
    $('#edit_book_language_title').text(application_language.edit_book_language_title);
    $('#edit_book_language_select_title').text(application_language.edit_book_language_select_title);
    $('#edit_book_language_rus_title').text(application_language.edit_book_language_rus_title);
    $('#edit_book_language_ukr_title').text(application_language.edit_book_language_ukr_title);
    $('#edit_book_language_eng_title').text(application_language.edit_book_language_eng_title);
    $('#edit_book_language_oth_title').text(application_language.edit_book_language_oth_title);
    $('#edit_book_cover_title').text(application_language.edit_book_cover_title);
    $('#edit_book_select_cover_title').text(application_language.edit_book_select_cover_title);
    $('#edit_book_select_hard_title').text(application_language.edit_book_select_hard_title);
    $('#edit_book_select_soft_title').text(application_language.edit_book_select_soft_title);
    $('#edit_book_illustrations_title').text(application_language.edit_book_illustrations_title);
    $('#edit_book_select_illustrations_title').text(application_language.edit_book_select_illustrations_title);
    $('#edit_book_select_illustrations_no_title').text(application_language.edit_book_select_illustrations_no_title);
    $('#edit_book_select_illustrations_bw_title').text(application_language.edit_book_select_illustrations_bw_title);
    $('#edit_book_select_illustrations_color_title').text(application_language.edit_book_select_illustrations_color_title);
    $('#edit_book_age_group_title').text(application_language.edit_book_age_group_title);
    $('#edit_book_select_age_title').text(application_language.edit_book_select_age_title);
    $('#edit_book_select_age_baby_title').text(application_language.edit_book_select_age_baby_title);
    $('#edit_book_select_age_preschool_title').text(application_language.edit_book_select_age_preschool_title);
    $('#edit_book_select_age_junior_title').text(application_language.edit_book_select_age_junior_title);
    $('#edit_book_select_age_midschool_title').text(application_language.edit_book_select_age_midschool_title);
    $('#edit_book_select_age_adult_title').text(application_language.edit_book_select_age_adult_title);
    $('#edit_book_description_title').text(application_language.edit_book_description_title);
    $('#edit_book_images_description_title').text(application_language.edit_book_images_description_title);
    $('#edit_fileButton').text(application_language.edit_fileButton);
    $('#edit_book_close_title').text(application_language.edit_book_close_title);
    $('#edit_book_button_title').text(application_language.edit_book_button_title);

    $('#message_close_button_title').text(application_language.message_close_button_title);
    $('#delete_book_modal_body_title').text(application_language.delete_book_modal_body_title);
    $('#delete_book_modal_title_title').text(application_language.delete_book_modal_title_title);
    $('#delete_book_close_title').text(application_language.delete_book_close_title);
    $('#delete_book_delete_title').text(application_language.delete_book_delete_title);

    $('#image_close_button_title').text(application_language.image_close_button_title);
    // $('#image_preview_modal_title').text(application_language.image_preview_modal_title);
    $('#image_close_button_footer_title').text(application_language.image_close_button_footer_title);

    $('#profile_name_title').text(application_language.profile_name_title);
    $('#profile_surname_title').text(application_language.profile_surname_title);
    $('#profile_book_to_the_moon_title').text(application_language.profile_book_to_the_moon_title);
    $('#profile_hero_title').text(application_language.profile_hero_title);
    $('#profile_year_title').text(application_language.profile_year_title);
    $('#profile_gender_title').text(application_language.profile_gender_title);
    $('#profile_gender_select_title').text(application_language.profile_gender_select_title);
    $('#profile_gender_female_title').text(application_language.profile_gender_female_title);
    $('#profile_gender_male_title').text(application_language.profile_gender_male_title);
    $('#profile_super_power_title').text(application_language.profile_super_power_title);
    $('#profile_book_of_the_year_title').text(application_language.profile_book_of_the_year_title);
    $('#profile_hobby_title').text(application_language.profile_hobby_title);
    $('#profile_country_title').text(application_language.profile_country_title);
    $('#profile_city_title').text(application_language.profile_city_title);
    $('#edit_profile_city').attr("placeholder", application_language.profile_city_set_me_title);
    $('#profile_district_title').text(application_language.profile_district_title);
    $('#profile_fb_title').text(application_language.profile_fb_title);
    $('#profile_telegram_title').text(application_language.profile_telegram_title);
    $('#profile_viber_title').text(application_language.profile_viber_title);
    $('#profile_update_button_title').text(application_language.profile_update_button_title);
    $('#change_language_title').text(application_language.change_language_title);
    $('#change_language_close_title').text(application_language.change_language_close_title);
    $('#menu_find_title').text(application_language.menu_find_title);
    $('#log_out_title').text(application_language.log_out_title);
    $('#profile_about_title').text(application_language.profile_about_title);
    $('#profile_about_text1').html(application_language.profile_about_text1);
    $('#profile_about_text2').html(application_language.profile_about_text2);
    $('#delete_reader_image_title').prop('title', application_language.delete_reader_image_title);
    clickHomeForTheFirstTime();
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

function resetLanguageOnCabinet() {
    getLanguageFromLocalStorage();

    if (application_language == ua) {
        setUaLanguageOnUI();
    } else if (application_language == ru) {
        setRuLanguageOnUI();
    }

}
