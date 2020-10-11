function showReaderDetails(readerId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal("Reader details for reader with id " + readerId + " cannot be found");
                return false;
            } else if (this.status === 200) {
                let detail = JSON.parse(this.responseText);
                console.log(detail);
                let nameSurname = notNull(detail.name) + ' ' + notNull(detail.surname);
                let heartId = 'heart' + detail.id;
                let nameSurnameHeart = nameSurname + '<i href="#" style="float: right" id="' + heartId + '" ';

                if (detail.friend) {
                    nameSurnameHeart += 'class="fa fa-heart underlined" onclick="removeFriend(' +
                        getCurrentUserId() + ', ' + readerId + ', \'' + nameSurname + '\', \'' + heartId + '\'); ' +
                        'return false;"></i>';
                } else {
                    nameSurnameHeart += 'class="fa fa-heart-o underlined" onclick="addFriend(' +
                        getCurrentUserId() + ', ' + readerId + ', \'' + nameSurname + '\', \'' + heartId + '\'); ' +
                        'return false;"></i>';
                }

                setPageTitle(nameSurnameHeart);

                let html =
                    '<div class="row">\n' +
                    '  <div class="form-group col-sm-6">\n' +
                    '    <div class="text-muted">Country:</div>\n' +
                    '    <div>' + notNull(detail.country) + '</div><br>\n' +
                    '    <div class="text-muted">City:</div>\n' +
                    '    <div>' + notNull(detail.city) + '</div><br>\n' +
                    '    <div class="text-muted">District:</div>\n' +
                    '    <div>' + notNull(detail.district) + '</div><br>\n' +
                    '    <div class="text-muted">Telegram:</div>\n' +
                    '    <div>' + notNull(detail.telegram) + '</div><br>\n' +
                    '    <div class="text-muted">Viber:</div>\n' +
                    '    <div>' + notNull(detail.viber) + '</div><br>\n' +
                    '    <div class="text-muted">Year of birth:</div>\n' +
                    '    <div>' + notNull(detail.yearOfBirth) + '</div><br>\n' +
                    '    <div class="text-muted">Gender:</div>\n' +
                    '    <div>' + genderToString(detail.gender) + '</div><br>\n' +
                    '    <div class="text-muted">Superpower:</div>\n' +
                    '    <div>' + genderToString(detail.superPower) + '</div><br>\n' +
                    '  </div>\n' +
                    '  <div class="form-group col-sm-6">\n' +
                    '    <img id="selected_reader_image" src="images/reader-girl.png" class="reader-image">\n' +
                    '  </div>\n' +
                    '</div>\n' +
                    '<span class="text-muted">Book one would take to Mars: ' + notNull(detail.bookToTheMoon) + '</span><br/>\n' +
                    '<span class="text-muted">When there is nothing to read: ' + notNull(detail.hobby) + '</span><br/>\n' +
                    '<span class="text-muted">Hero: ' + notNull(detail.hero) + '</span><br/>\n' +
                    '<span class="text-muted">Book of the year: ' + notNull(detail.bookOfTheYear) + '</span><br/>\n';

                if (detail.fbPage != null) {
                    html +=
                        '<span class="text-muted">Facebook: </span>' +
                        '    <a href=' + detail.fbPage + ' target="_blank" class="underline">open</a></h5>\n';
                }

                html += '<h5><a href="#" class="right-sidebar-toggle"\n' +
                    '    onclick="openConversation(' + detail.id + ',\'' + nameSurname + '\');"\n' +
                    '    data-sidebar-id="main-right-sidebar"><i class="fa fa-envelope"></i></a></h5>';
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
                        '            <h5 class="text-muted"> by ' + notNull(book.authorName) + ' ' + notNull(book.authorSurname) + '</h5>\n' +
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
                showWarningModal('Not any friend added yet. Click on <i class="fa fa-heart-o"></i> icon next to any reader')
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
                        ' <i class="fa fa-heart" id = \'' + heartId + '\' style="float: right"></i>' +
                        ' <h5><span class="text-muted"> City: </span> ' + notNull(reader.city) + '</h5>\n';

                    if (reader.fbPage != null) {
                        html +=
                            ' <h5><span class="text-muted"> Facebook page: </span> ' +
                            '     <a href=' + reader.fbPage + ' target="_blank" class="underline">view</a></h5>\n';
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
                showWarningModal('not found')
            } else if (this.status === 403) {
                showWarningModal(friend2 + ' is already a friend of ' + friend1);
            } else if (this.status === 200) {
                showSuccessModal(friend2NameSurname + ' has been successfully added to friends');
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
                showWarningModal('not found')
            } else if (this.status === 403) {
                showWarningModal(friend2 + ' is not a friend of ' + friend1);
            } else if (this.status === 200) {
                showSuccessModal(friend2NameSurname + ' has been successfully removed from friends');
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
        '      <input type="text" class="form-control" id="search_reader_name" placeholder="Name">\n' +
        '    </div>\n' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_reader_surname" placeholder="Surname">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_country" placeholder="Country">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_city" placeholder="City">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_district" placeholder="District">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_reader_gender">\n' +
        '                <option value="0">Gender</option>\n' +
        '                <option value="1">female</option>\n' +
        '                <option value="2">male</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-offset-3 col-sm-3">\n' +
        '      <button type="submit" class="btn btn-default right" onclick="searchReadersByCriteria(); return false">Search</button>\n' +
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
                showWarningModal('nothing found');
            }
            displayFoundReaders(this.responseText);
        }
        if (this.readyState === 4 && this.status == 404) {
            showWarningModal('No reader fitting your criteria was found. Try to soften the borders');
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
            '               aria-expanded="true" aria-controls="collapse' + reader.id + '">\n' + reader.name + ' ' + reader.surname +
            '            <h5 class="text-muted"> Country: ' + notNull(reader.country) + '</h5>\n' +
            '            <h5 class="text-muted"> City: ' + notNull(reader.city) + '</h5>\n' +
            '            <h5 class="text-muted"> District: ' + notNull(reader.district) + '</h5>\n' +
            '            <h5 class="text-muted"> Gender: ' + genderToString(reader.gender) +'</h5>\n' +
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
