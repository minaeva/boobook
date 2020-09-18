function showProfile() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let readerDetails = JSON.parse(this.responseText);
                console.log(readerDetails);
                let nameSurname = readerDetails.name + ' ' + readerDetails.surname;
                document.getElementById("name_surname").innerHTML = nameSurname;

                let info = '<li><p><i class="fa fa-map-marker m-r-xs"></i>' + notNull(readerDetails.city) + '</p></li>' +
                    '<li><p><i class="fa fa-paper-plane-o m-r-xs"></i>' + notNull(readerDetails.email) + '</p></li>' +
                    '<li><p><i class="fa fa-facebook m-r-xs"></i><a href="' + notNull(readerDetails.fbPage) + '" target="_blank">' +
                    notNull(readerDetails.fbPage) + '</a></p></li>' +
                    '<li><p><i class="fa fa-telegram m-r-xs"></i><a href="#">' + notNull(readerDetails.telegram) + '</a></p></li>' +
                    '<li><p><i class="fa fa-whatsapp m-r-xs"></i><a href="#">' + notNull(readerDetails.whatsapp) + '</a></p></li>' +
                    '<li><p><i class="fa fa-skype m-r-xs"></i><a href="#">' + notNull(readerDetails.skype) + '</a></p></li>' +
                    '<li><p><i class="fa fa-phone-square m-r-xs"></i><a href="#">' + notNull(readerDetails.viber) + '</a></p></li>';

                document.getElementById("info").innerHTML = info;

                let buttonHtml = '<button class="btn btn-default" onclick="openEditProfileModal(\'' +
                    readerDetails.name + '\',\'' + readerDetails.surname + '\',\'' + notNull(readerDetails.city) +
                    '\',\'' +
                    notNull(readerDetails.telegram) + '\',\'' + notNull(readerDetails.fbPage) + '\',\'' + notNull(readerDetails.viber) + '\',\'' +
                    notNull(readerDetails.skype) + '\',\'' + notNull(readerDetails.whatsapp) +
                    '\'); return false;">Edit</button>';

                $('#edit_profile_button').html(buttonHtml);

                document.getElementById("profile_title").innerHTML = 'My profile';
            }
        }
    }

    let id = getCurrentUserId();
    let requestUrl = HOME_PAGE + "/users/" + id;
    xhttp.open("GET", requestUrl);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhttp);
    xhttp.send();

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
