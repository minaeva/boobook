function showProfile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var readerDetails = JSON.parse(this.responseText);
                console.log(readerDetails);
                var nameSurname = readerDetails.name + ' ' + readerDetails.surname;
                document.getElementById("name_surname").innerHTML = nameSurname;

                var info = '<li><p><i class="fa fa-map-marker m-r-xs"></i>' + notNull(readerDetails.city) + '</p></li>' +
                    '<li><p><i class="fa fa-paper-plane-o m-r-xs"></i>' + notNull(readerDetails.email) + '</p></li>' +
                    '<li><p><i class="fa fa-facebook m-r-xs"></i><a href="' + notNull(readerDetails.fbPage) + '" target="_blank">' +
                    notNull(readerDetails.fbPage) + '</a></p></li>' +
                    '<li><p><i class="fa fa-telegram m-r-xs"></i><a href="#">' + notNull(readerDetails.telegram) + '</a></p></li>' +
                    '<li><p><i class="fa fa-whatsapp m-r-xs"></i><a href="#">' + notNull(readerDetails.whatsapp) + '</a></p></li>' +
                    '<li><p><i class="fa fa-skype m-r-xs"></i><a href="#">' + notNull(readerDetails.skype) + '</a></p></li>' +
                    '<li><p><i class="fa fa-phone-square m-r-xs"></i><a href="#">' + notNull(readerDetails.viber) + '</a></p></li>';

                document.getElementById("info").innerHTML = info;

                var buttonHtml = '<button class="btn btn-default" onclick="showEditProfileModal(\'' +
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

    var id = getCurrentUserId();
    var requestUrl = HOME_PAGE + "/users/" + id;
    xhttp.open("GET", requestUrl);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function showEditProfileModal(name, surname, city, telegram, fb, viber, skype, whatsapp) {
    $('#editProfileModal').modal('show');
    $('#edit_profile_name').val(name);
    $('#edit_profile_surname').val(surname);
    $('#edit_profile_city').val(city);
    $('#edit_profile_telegram').val(telegram);
    $('#edit_profile_fb').val(fb);
    $('#edit_profile_viber').val(viber);
    $('#edit_profile_skype').val(skype);
    $('#edit_profile_whatsapp').val(whatsapp);

    return false;
}

function saveProfile() {
    return false;
}
