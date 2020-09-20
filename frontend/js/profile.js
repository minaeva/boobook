function showProfile() {
    let src = document.getElementById("edit_reader_src");
    let target = document.getElementById("edit_reader_target");
    showOnePreview(src, target);

    $('#edit_profile_name').focus();

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

                $("#edit_profile_name").val(readerDetails.name);
                $("#edit_profile_surname").val(readerDetails.surname);
                $("#edit_book_to_the_moon").val(readerDetails.bookToTheMoon);
                $("#edit_book_of_the_year").val(readerDetails.bookOfTheYear);
                $("#edit_year_of_birth").val(readerDetails.yearOfBirth);
                $("#edit_gender").val(readerDetails.gender);
                $("#edit_super_power").val(readerDetails.superPower);
                $("#edit_hero").val(readerDetails.hero);
                $("#edit_hobby").val(readerDetails.hobby);
                $("#edit_profile_city").val(readerDetails.city);
                $("#edit_profile_telegram").val(readerDetails.telegram);
                $("#edit_profile_fb").val(readerDetails.fbPage);
                $("#edit_profile_viber").val(readerDetails.viber);


                let img = readerDetails.image;
                if (img != null) {
                    let source = "data:image/png;base64," + img;
                    let image = document.getElementById('edit_reader_target');
                    let srcExist = image.src;
                    alert(srcExist);
                    image.src = source;
                    // $("#edit_reader_target").attr("src",source);
                }
                /*
                let buttonHtml = '<button class="btn btn-default" onclick="openEditProfileModal(\'' +
                    readerDetails.name + '\',\'' + readerDetails.surname + '\',\'' + notNull(readerDetails.city) +
                    '\',\'' +
                    notNull(readerDetails.telegram) + '\',\'' + notNull(readerDetails.fbPage) + '\',\'' + notNull(readerDetails.viber) + '\',\'' +
                    notNull(readerDetails.skype) + '\',\'' + notNull(readerDetails.whatsapp) +
                    '\'); return false;">Edit</button>';

                $('#edit_profile_button').html(buttonHtml);
*/
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
