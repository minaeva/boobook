let PROFILE_IMAGE_EDITED;

function showProfile() {
    let src = document.getElementById("edit_reader_src");
    let target = document.getElementById("edit_reader_target");
    showProfilePreview(src, target);

    $('#edit_profile_name').focus();
    $('#update_profile_btn').addClass('disabled');
    PROFILE_IMAGE_EDITED = false;

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let readerDetails = JSON.parse(this.responseText);
                console.log(readerDetails);
                let nameSurname = notNull(readerDetails.name);
                nameSurname += (readerDetails.surname == null || readerDetails.surname == '') ? '' : ' ' + readerDetails.surname;
                setPageTitle(nameSurname);
                setPageSubtitle('');

                if (readerDetails.image != null) {
                    showProfileImage(readerDetails.image);
                }

                $("#edit_profile_name").val(readerDetails.name);
                $("#edit_profile_surname").val(readerDetails.surname);
                $("#edit_profile_book_to_the_moon").val(readerDetails.bookToTheMoon);
                $("#edit_profile_hero").val(readerDetails.hero);
                $("#edit_profile_year_of_birth").val(readerDetails.yearOfBirth);
                $("#edit_profile_gender").val(readerDetails.gender);
                $("#edit_profile_super_power").val(readerDetails.superPower);
                $("#edit_profile_book_of_the_year").val(readerDetails.bookOfTheYear);
                $("#edit_profile_hobby").val(readerDetails.hobby);
                $("#edit_profile_country").val(readerDetails.country);
                $("#edit_profile_city").val(readerDetails.city);
                $("#edit_profile_district").val(readerDetails.district);
                $("#edit_profile_telegram").val(readerDetails.telegram);
                $("#edit_profile_fb").val(readerDetails.fbPage);
                $("#edit_profile_viber").val(readerDetails.viber);
                addProfileUpdateListeners();

                $("#update_profile_btn").click(function () {
                        let changedImage = retrieveProfileImage();

                        updateProfile(readerDetails.id,
                            $("#edit_profile_name").val().trim(),
                            $("#edit_profile_surname").val().trim(),
                            $("#edit_profile_book_to_the_moon").val().trim(),
                            $("#edit_profile_hero").val().trim(),
                            $("#edit_profile_year_of_birth").val(),
                            $("#edit_profile_gender").val(),
                            $("#edit_profile_super_power").val().trim(),
                            $("#edit_profile_book_of_the_year").val().trim(),
                            $("#edit_profile_hobby").val().trim(),
                            $("#edit_profile_country").val().trim(),
                            $("#edit_profile_city").val().trim(),
                            $("#edit_profile_district").val().trim(),
                            $("#edit_profile_fb").val().trim(),
                            $("#edit_profile_telegram").val().trim(),
                            $("#edit_profile_viber").val().trim(),
                            changedImage);
                    }
                );
            }
        }
    }

    let id = getCurrentUserId();
    let requestUrl = HOME_PAGE + "/users/" + id;
    xhr.open("GET", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function updateProfile(id, name, surname, bookToTheMoon, hero, yearOfBirth, gender, superPower, bookOfTheYear, hobby,
                       country, city, district, fb, telegram, viber, changedImage) {
    if (!validateProfileInfo(name, yearOfBirth)) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 500) {
                showWarningModal("When updating the reader info, there was a server error");
                return false;
            } else if (this.status == 403) {
                showWarningModal("When updating the reader info, there was a problem with authentication");
                return false;
            } else if (this.status == 200) {
                console.log("User info updated!");
                if (PROFILE_IMAGE_EDITED == true && changedImage != null) {
                    saveProfileImage(id, changedImage)
                }
                showSuccessModal('Profile data has been updated');
                showProfile();
            }
        }
    };

    const requestBody = {
        "id": id,
        "name": name,
        "surname": surname,
        "bookToTheMoon": bookToTheMoon,
        "hero": hero,
        "yearOfBirth": yearOfBirth,
        "gender": gender,
        "superPower": superPower,
        "bookOfTheYear": bookOfTheYear,
        "hobby": hobby,
        "country": country,
        "city": city,
        "district": district,
        "fb": f,
        "telegram": telegram,
        "viber": viber
    };
    console.log(requestBody);

    let requestUrl = HOME_PAGE + "/users";
    xhr.open("PUT", requestUrl);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    addAuthorization(xhr);
    xhr.send(JSON.stringify(requestBody));
}

function saveProfileImage(readerId, image) {
    let formData = new FormData();
    formData.append('file', image);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 500) {
                showWarningModal("When updating the images, there was a server error");
                return false;
            } else if (this.status == 403) {
                showWarningModal("When updating the images, there was a problem with authentication");
                return false;
            } else if (this.status == 200) {
                console.log("Images updated");
            }
        }
    };

    let requestUrl = HOME_PAGE + "/users/" + readerId;
    xhr.open("PUT", requestUrl);
    addAuthorization(xhr);
    xhr.send(formData);
}

function enableOnChange(event) {
    let elem = document.getElementById('update_profile_btn');
    if (elem.classList.contains('disabled')) {
        elem.classList.remove('disabled');
    }
}

function addProfileUpdateListeners() {
    document.querySelectorAll('input').forEach((elem) => {
        elem.addEventListener('change', enableOnChange);
    });
    document.querySelectorAll('textarea').forEach((elem) => {
        elem.addEventListener('change', enableOnChange);
    });
    document.getElementById('edit_profile_gender')
        .addEventListener('change', enableOnChange);
}

function openEditProfileModal(name, surname, city, telegram, fb, viber, skype, whatsapp) {
    $('#editProfileModal').modal('show');
    $('#editProfileModal').on('shown.bs.modal', function () {
        $('#edit_profile_name').focus();
    })

    let src = document.getElementById("edit_reader_src");
    let target = document.getElementById("edit_reader_target");
    showOnePreview(src, target);

    $('#edit_profile_name').val(name);
    $('#edit_profile_surname').val(surname);
    $('#edit_profile_city').val(city);
    $('#edit_profile_telegram').val(telegram);
    $('#edit_profile_fb').val(fb);
    $('#edit_profile_viber').val(viber);

    return false;
}

function saveProfile() {
    return false;
}
