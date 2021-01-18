function showReaderDetails(readerId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal(application_language.readerDetailsWithId_title + readerId + application_language.cannotBeFound_title);
                return false;
            } else if (this.status === 200) {
                let detail = JSON.parse(this.responseText);
                console.log(detail);
                let nameSurname = notNull(detail.name) + ' ' + notNull(detail.surname);
                setPageTitle(nameSurname);

                let html =
                    '<div class="row">\n' +
                    '  <div class="form-group col-sm-6">\n';

                if (!isEmpty(detail.country)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_country_title + ':</div>\n' +
                        '    <div>' + notNull(detail.country) + '</div><br>\n';
                }
                if (!isEmpty(detail.city)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_city_title + ':</div>\n' +
                        '    <div>' + notNull(detail.city) + '</div><br>\n';
                }
                if (!isEmpty(detail.district)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_district_title + ':</div>\n' +
                        '    <div>' + notNull(detail.district) + '</div><br>\n';
                }
                if (!isEmpty(detail.telegram)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_telegram_title + ':</div>\n' +
                        '    <div>' + notNull(detail.telegram) + '</div><br>\n';
                }
                if (!isEmpty(detail.viber)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_viber_title + ':</div>\n' +
                        '    <div>' + notNull(detail.viber) + '</div><br>\n';
                }
                if (!isEmpty(detail.yearOfBirth)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_year_title + ':</div>\n' +
                        '    <div>' + notNull(detail.yearOfBirth) + '</div><br>\n';
                }
                if (!isEmpty(detail.gender) && detail.gender != 0) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_gender_title + ':</div>\n' +
                        '    <div>' + genderToString(detail.gender) + '</div><br>\n';
                }
                if (!isEmpty(detail.superPower)) {
                    html +=
                        '    <div class="text-muted">' + application_language.profile_super_power_title + ':</div>\n' +
                        '    <div>' + notNull(detail.superPower) + '</div><br>\n';
                }
                if (!isEmpty(detail.bookToTheMoon)) {
                    html +=
                        '<div class="text-muted">' + application_language.profile_book_to_the_moon_title + ':</div>\n' +
                        '<div>' + notNull(detail.bookToTheMoon) + '</div><br>\n';
                }
                if (!isEmpty(detail.hobby)) {
                    html +=
                        '<div class="text-muted">' + application_language.profile_hobby_title + ':</div>\n' +
                        '<div>' + notNull(detail.hobby) + '</div><br>\n';
                }
                if (!isEmpty(detail.hero)) {
                    html +=
                        '<div class="text-muted">' + application_language.profile_hero_title + ':</div>\n' +
                        '<div>' + notNull(detail.hero) + '</div><br>\n';
                }
                if (!isEmpty(detail.bookOfTheYear)) {
                    html +=
                        '<div class="text-muted">' + application_language.profile_book_of_the_year_title + ':</div>\n' +
                        '<div>' + notNull(detail.bookOfTheYear) + '</div><br>\n';
                }
                if (!isEmpty(detail.fbPage)) {
                    html +=
                        '<div class="text-muted">' + application_language.profile_fb_title + ': </div>' +
                        '<div><a href=' + detail.fbPage + ' target="_blank" class="underline-blue">' + application_language.open_title + '</a></div>\n';
                }

                html +=
                    '  </div>\n' +
                    '  <div class="form-group col-sm-6">\n' +
                    '    <img id="selected_reader_image" src="images/reader.png" class="reader-image">\n' +
                    '  </div>\n' +
                    '</div>\n';

                let heartId = 'heart' + detail.id;
                html +=
                    '<button type="button" class="btn btn-default margin-3px">' +
                    '<a href="#" class="right-sidebar-toggle blue" title="' + application_language.send_message_title + '"\n' +
                    '    onclick="openConversation(' + detail.id + ',\'' + nameSurname + '\');"\n' +
                    '    data-sidebar-id="main-right-sidebar">' +
                    '<i class="fa fa-envelope"></i>&nbsp;&nbsp;' + application_language.send_message_title +
                    '</a>' +
                    '</button>&nbsp;&nbsp;' +
                    '<button type="button" class="btn btn-default margin-3px"';

                if (detail.friend) {
                    html +=
                        ' onclick="removeFriend(' + getCurrentUserId() + ', ' + readerId + ', \'' + nameSurname + '\', \'' + heartId + '\'); ' +
                        'return false;">' +
                        '<i href="#" id="' + heartId + '" ' +
                        'class="fa fa-heart underlined blue" title="' + application_language.remove_reader_from_favorites_title + '"' +
                        '></i>&nbsp;&nbsp;' + application_language.remove_reader_from_favorites_title + '</button>';
                } else {
                    html +=
                        ' onclick="addFriend(' + getCurrentUserId() + ', ' + readerId + ', \'' + nameSurname + '\', \'' + heartId + '\'); ' +
                        'return false;">' +
                        '<i href="#" id="' + heartId + '" ' +
                        'class="fa fa-heart-o underlined blue" title="' + application_language.add_reader_to_favorites_title + '"' +
                        '></i>&nbsp;&nbsp;' + application_language.add_reader_to_favorites_title + '</button>';
                }


                setPageSubtitle(html);

                if (detail.image != null) {
                    console.log(detail.image);
                    showReaderImage(detail.image);
                }
            }
        }
    }

    let getReaderByIdUrl = HOME_PAGE + "/users/" + readerId + "/" + getCurrentUserId();
    xhr.open("GET", getReaderByIdUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function openReaderPage(readerId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                let books = JSON.parse(this.responseText);
                let html = ' ';
                for (let i = 0; i < books.length; i++) {
                    let book = books[i];
                    console.log(book);
                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + book.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="showBookDetails(' + book.id + ', ' + book.ownerId + '); return false;" data-parent="#accordion" href="#collapse' + book.id + '"\n' +
                        '               aria-expanded="true" aria-controls="collapse' + book.id + '">\n' + book.title +
                        '            <h5 class="text-muted">' + notNull(book.authorName) + ' ' + notNull(book.authorSurname) + '</h5>\n' +
                        '            </a>\n' +
                        '        </h4>\n' +
                        '    </div>\n' +
                        '    <div id="collapse' + book.id + '" class="panel-collapse collapse" role="tabpanel"\n' +
                        '         aria-labelledby="heading' + book.id + '">\n' +
                        '    </div>\n' +
                        '</div>';
                }
                document.getElementById("accordion").innerHTML = html;
            }
        }
    }

    let getOwnBooksUrl = HOME_PAGE;
    if (readerId != getCurrentUserId()) {
        getOwnBooksUrl += "/books/owner/active/" + readerId;
    } else {
        getOwnBooksUrl += "/books/owner/" + readerId;
    }

    xhr.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function showAllReaders() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                let readers = JSON.parse(this.responseText);
                let html = '';
                for (let i = 0; i < readers.length; i++) {
                    let reader = readers[i];
                    console.log(reader);
                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="clickReader(' + reader.id + '); return false;" data-parent="#accordion" ' +
                        'href="#collapse' + reader.id + '"\n aria-expanded="true" aria-controls="collapse' + reader.id + '">\n';
                    let heartId = 'heart' + reader.id;
                    let nameSurname = notNull(reader.name) + ' ' + notNull(reader.surname);
                    html += nameSurname;
                    if (reader.friend) {
                        html += '<i class="fa fa-heart" id ="' + heartId + '" style="float: right"></i>';
                    } else {
                        html += '<i class="fa fa-heart-o" id ="' + heartId + '" style="float: right"></i>';
                    }
                    html +=
                        '<h5><span class="text-muted"> City: ' + notNull(reader.city) + '</span></h5>\n';

                    html +=
                        '               </a>\n' +
                        '        </h4>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("accordion").innerHTML = html;
            }
        }
    }

    let getAllReadersUrl = HOME_PAGE + "/users/allWithIsFriend/" + getCurrentUserId();
    xhr.open("GET", getAllReadersUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function showFavoriteReaders() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (404 === this.status) {
                showWarningModal(application_language.noneFriendYet_title + '<i class="fa fa-heart-o"></i>' + application_language.iconNextToReader_title)
            } else if (200 === this.status) {
                let readers = JSON.parse(this.responseText);
                let html = '';
                for (let i = 0; i < readers.length; i++) {
                    let reader = readers[i];
                    console.log(reader);
                    let heartId = 'heart' + reader.id;

                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="clickReader(' + reader.id +
                        '); return false;" data-parent="#accordion" href="#collapse' + reader.id + '"\n' +
                        '               aria-expanded="true" aria-controls="collapse' + reader.id + '">\n';
                    let nameSurname = notNull(reader.name) + ' ' + notNull(reader.surname);
                    html += nameSurname +
                        ' <i class="fa fa-heart" id = \'' + heartId + '\' style="float: right"></i>';
                    if (!isEmpty(reader.city)) {
                        html +=
                            ' <h5><span class="text-muted">' + application_language.profile_city_title + ': </span> ' + notNull(reader.city) + '</h5>\n';
                    }

                    if (!isEmpty(reader.fbPage)) {
                        html +=
                            ' <h5><span class="text-muted">' + application_language.profile_fb_title + ': </span> ' +
                            '     <a href=' + reader.fbPage + ' target="_blank" class="underline">Facebook</a></h5>\n';
                    }
                    html +=
                        '               </a>\n' +
                        '        </h4>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("accordion").innerHTML = html;
            }
        }
    }

    let getFriendsUrl = HOME_PAGE + "/users/friends/" + getCurrentUserId();
    console.log(getFriendsUrl);
    xhr.open("GET", getFriendsUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function addFriend(friend1, friend2, friend2NameSurname, heartId) {
    changeElementClass(heartId, 'fa-heart-o', 'fa-heart');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal(friend2 + application_language.cannotBeFound_title)
            } else if (this.status === 403) {
                showWarningModal(friend2 + application_language.isAlreadyFriendOf_title + friend1);
            } else if (this.status === 200) {
                showSuccessModal(application_language.reader_title + friend2NameSurname + application_language.hasBeenAddedToFriends);
                showReaderDetails(friend2);
            }
        }
    }

    let addFriendUrl = HOME_PAGE + "/users/friends/" + friend1 + "/" + friend2;
    xhr.open("POST", addFriendUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function removeFriend(friend1, friend2, friend2NameSurname, heartId) {
    changeElementClass(heartId, 'fa-heart', 'fa-heart-o');

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal(friend2 + application_language.cannotBeFound_title);
            } else if (this.status === 403) {
                showWarningModal(friend2 + application_language.isNotAFriendOf_title + friend1);
            } else if (this.status === 200) {
                showSuccessModal(application_language.reader_title + friend2NameSurname + application_language.hasBeenRemovedFromFriends);
                showReaderDetails(friend2);
            }
        }
    }

    let deleteFriendUrl = HOME_PAGE + "/users/friends/" + friend1 + "/" + friend2;
    xhr.open("DELETE", deleteFriendUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function showSearchReadersHeader() {
    let searchForm =
        '  <div class="row">' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_reader_name" placeholder="' +
        application_language.profile_name_title + '">\n' +
        '    </div>\n' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_reader_surname" placeholder="' +
        application_language.profile_surname_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_country" placeholder="' +
        application_language.profile_country_title + '">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_city" placeholder="' +
        application_language.profile_city_title + '">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_district" placeholder="' +
        application_language.profile_district_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_reader_gender">\n' +
        '                <option value="0">' + application_language.profile_gender_title + '</option>\n' +
        '                <option value="1">' + application_language.profile_gender_female_title + '</option>\n' +
        '                <option value="2">' + application_language.profile_gender_male_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-offset-3 col-sm-3">\n' +
        '      <button type="submit" class="btn btn-default right" onclick="searchReadersByCriteria(); return false">' +
        application_language.search_button_title + '</button>\n' +
        '    </div>\n' +
        '  </div>\n';
    setPageSubtitle(searchForm);
}

function searchReadersByCriteria() {
    let search_name = document.getElementById('search_reader_name').value;
    let search_surname = document.getElementById('search_reader_surname').value;
    let search_country = document.getElementById('search_reader_country').value;
    let search_city = document.getElementById('search_reader_city').value;
    let search_district = document.getElementById('search_reader_district').value;
    let search_gender = document.getElementById('search_reader_gender').value;

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;
            if (size == 0) {
                showWarningModal(application_language.noReaderWasFound_title);
            }
            displayFoundReaders(this.responseText);
        }
        if (this.readyState === 4 && this.status == 404) {
            showWarningModal(application_language.noReaderWasFound_title);
        }

    };

    const requestBody = {
        "name": search_name,
        "surname": search_surname,
        "country": search_country,
        "city": search_city,
        "district": search_district,
        "gender": search_gender
    };
    console.log(requestBody);
    let requestUrl = HOME_PAGE + "/users/search";
    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhr);
    xhr.send(JSON.stringify(requestBody));

    return false;
}

function displayFoundReaders(response) {
    let readers = JSON.parse(response);
    let html = '';
    for (let i = 0; i < readers.length; i++) {
        let reader = readers[i];
        console.log(reader);
        html +=
            '<div class="panel panel-default">\n' +
            '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
            '        <h4 class="panel-title">\n' +
            '            <a data-toggle="collapse" onclick="clickReader(' + reader.id + '); return false;" data-parent="#accordion" href="#collapse' + reader.id + '"\n' +
            '               aria-expanded="true" aria-controls="collapse' + reader.id + '">\n' + reader.name;
        if (!isEmpty(reader.surname)) {
            html += ' ' + reader.surname;
        }
        if (!isEmpty(reader.country)) {
            html +=
                '            <h5 class="text-muted">' + application_language.profile_country_title + ': ' + notNull(reader.country) + '</h5>\n';
        }
        if (!isEmpty(reader.city)) {
            html +=
                '            <h5 class="text-muted">' + application_language.profile_city_title + ': ' + notNull(reader.city) + '</h5>\n';
        }
        if (!isEmpty(reader.district)) {
            html +=
                '            <h5 class="text-muted">' + application_language.profile_district_title + ': ' + notNull(reader.district) + '</h5>\n';
        }
        if (!isEmpty(reader.gender) && reader.gender != 0) {
            html +=
                '            <h5 class="text-muted">' + application_language.profile_gender_title + ': ' + genderToString(reader.gender) + '</h5>\n';
        }
        html +=
            '            </a>\n' +
            '        </h4>\n' +
            '    </div>\n' +
            '    <div id="collapse' + reader.id + '" class="panel-collapse collapse" role="tabpanel"\n' +
            '         aria-labelledby="heading' + reader.id + '">\n' +
            '    </div>\n' +
            '</div>'
    }
    document.getElementById("accordion").innerHTML = html;
    return false;
}
