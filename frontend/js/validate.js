const NAME_SURNAME_HERO_50 = 50;
const COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30 = 30;
const FB_PAGE_100 = 100;
const MOON_BOOK_YEAR_HOBBY_POWER_200 = 200;

function validateNamePassword(field, warningText) {
    if (field == null || field == "") {
        showWarningModal(warningText);
        return false;
    }
    return true;
}

function validateField(field, groupControlId) {
    let group = document.getElementById(groupControlId);
    if (field == null || field == "") {
        group.classList.add('has-error');
        return false;
    }
    if (group.classList.contains('has-error')) {
        group.classList.remove('has-error');
    }
    return true;
}

function validateImage(field, groupControlId) {
    let group = document.getElementById(groupControlId);
    if (field == null || field == "") {
        group.classList.add('has-error');
        return false;
    }
    if (group.classList.contains('has-error')) {
        group.classList.remove('has-error');
    }
    return true;
}

function validateYear(year, groupId) {
    let element = document.getElementById(groupId);

    if (year == null || year == "") {
        if (element.classList.contains('has-error')) {
            element.classList.remove('has-error');
        }
        return true;
    }
    if (isNaN(year)) {
        element.classList.add('has-error');
        return false;
    }
    if (year < 1454) {
        showWarningModal("The Gutenberg Bible, also known as the 42-line Bible, is listed by the Guinness Book of World records as the world's oldest mechanically printed book – the first copies of which were printed in 1454-1455 AD");
        element.classList.add('has-error');
        return false;
    }
    if (year > new Date().getFullYear()) {
        showWarningModal('Boobook is expected to be used for the already existent books only');
        element.classList.add('has-error');
        return false;
    }
    if (element.classList.contains('has-error')) {
        element.classList.remove('has-error');
    }
    return true;
}

function validateProfileInfo(name, surname, bookToTheMoon, hero, yearOfBirth, gender, superPower, bookOfTheYear, hobby,
                             country, city, district, fb, telegram, viber) {
    let isValidated = false;
    let errorText = "";
    if (!validateProfileName(name)) {
        errorText += 'Name cannot be longer that 50 symbols';
        isValidated = true;
    }
    if (!validateProfileField('profile_surname_group', name, NAME_SURNAME_HERO_50)) {
        errorText += 'Surname cannot be longer that 50 symbols';
        isValidated = true;
    }
    if (!validateProfileField('profile_book_to_the_moon_group', bookToTheMoon, MOON_BOOK_YEAR_HOBBY_POWER_200)) {
        errorText += "Book you'd take to the Mars cannot be longer that 200 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_hero_group', hero, NAME_SURNAME_HERO_50)) {
        errorText += "Hero you are similar to cannot be longer that 50 symbols";
        isValidated = true;
    }
    if (validateYearOfBirth(yearOfBirth)) {
        errorText += 'It is supposed the year of birth is more than 1919 an less than the current one';
        isValidated = true;
    }
    if (!validateProfileField('profile_super_power_group', superPower, MOON_BOOK_YEAR_HOBBY_POWER_200)) {
        errorText += "Superpower cannot be longer that 200 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_book_of_the_year_group', bookOfTheYear, MOON_BOOK_YEAR_HOBBY_POWER_200)) {
        errorText += "Book of the last year cannot be longer that 200 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_hobby_group', hobby, MOON_BOOK_YEAR_HOBBY_POWER_200)) {
        errorText += "What you do when there's nothing to do cannot be longer that 200 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_country_group', country, COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30)) {
        errorText += "Country cannot be longer that 30 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_city_group', city, COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30)) {
        errorText += "City cannot be longer that 30 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_district_group', district, COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30)) {
        errorText += "District cannot be longer that 30 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_facebook_group', fb, FB_PAGE_100)) {
        errorText += "Facebook page value cannot be longer that 100 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_telegram_group', telegram, COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30)) {
        errorText += "Telegram value cannot be longer that 30 symbols";
        isValidated = true;
    }
    if (!validateProfileField('profile_viber_group', viber, COUNTRY_CITY_DISTRICT_TELEGRAM_VIBER_30)) {
        errorText += "Viber value cannot be longer that 30 symbols";
        isValidated = true;
    }

    if (isValidated) {
        return true;
    }

    showWarningModal(errorText);
    return false;
}

function validateProfileField(groupId, fieldValue, valueMaximum) {
    let group = document.getElementById(groupId);
    if (fieldValue.length > valueMaximum) {
        group.classList.add('has-error');
        // showWarningModal(errorText);
        return false;
    }
    if (group.classList.contains('has-error')) {
        group.classList.remove('has-error');
    }
    return true;
}

function validateProfileName(name) {
    validateField(name, 'profile_name_group');
    if (name.length > NAME_SURNAME_HERO_50) {
        // showWarningModal('Name cannot be longer that 50 symbols');
        return false;
    }
    return true;
}

function validateYearOfBirth(year) {
    let element = document.getElementById('profile_year_of_birth_group');

    if (year == null || year == "") {
        if (element.classList.contains('has-error')) {
            element.classList.remove('has-error');
        }
        return true;
    }
    if (isNaN(year)) {
        element.classList.add('has-error');
        return false;
    }
    if (year < 1920 || year > new Date().getFullYear()) {
        // showWarningModal('It is supposed the year of birth is more than 1919 an less than the current one');
        element.classList.add('has-error');
        return false;
    }
    if (element.classList.contains('has-error')) {
        element.classList.remove('has-error');
    }
    return true;

}
