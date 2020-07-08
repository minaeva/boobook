
function showReaderDetails(readerId) {
    setPageSubtitle('');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal("Reader details for reader with id " + readerId + " cannot be found");
                return false;
            } else if (this.status === 200) {
                var detail = JSON.parse(this.responseText);
                console.log(detail);
                var nameSurname = notNull(detail.name) + ' ' + notNull(detail.surname);
                var heartId = 'heart' + detail.id;
                var nameSurnameHeart = nameSurname + '<i href="#" style="float: right" id="' + heartId + '" ';

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

                var html = '<span class="text-muted">City: ' + notNull(detail.city) + '</span><br/>\n';
                if (detail.fbPage != null) {
                    html +=
                        '<span class="text-muted">Facebook: </span>' +
                        '    <a href=' + detail.fbPage + ' target="_blank" class="underline">view</a></h5>\n';
                }
                setPageSubtitle(html);
            }
        }
    }

    var getReaderByIdUrl = HOME_PAGE + "/users/" + readerId + "/" + getCurrentUserId();
    xhttp.open("GET", getReaderByIdUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function openReaderPage(readerId) {
    if (readerId != getCurrentUserId()) {
        selectMenu("menu_readers", '');
        showReaderDetails(readerId);
    } else {
        selectMenu("menu_home", 'My Books');
    }
    document.getElementById("accordion").innerHTML = '';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                var books = JSON.parse(this.responseText);
                var html = ' ';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
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

    var getOwnBooksUrl = HOME_PAGE + "/books/owner/" + readerId;
    xhttp.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function showAllReaders() {
    selectMenu("menu_readers", 'Readers');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                var readers = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < readers.length; i++) {
                    var reader = readers[i];
                    console.log(reader);
                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="openReaderPage(' + reader.id + '); return false;" data-parent="#accordion" ' +
                        'href="#collapse' + reader.id + '"\n aria-expanded="true" aria-controls="collapse' + reader.id + '">\n';
                    var heartId = 'heart' + reader.id;
                    var nameSurname = notNull(reader.name) + ' ' + notNull(reader.surname);
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

    var getAllReadersUrl = HOME_PAGE + "/users/allWithIsFriend/" + getCurrentUserId();
    xhttp.open("GET", getAllReadersUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function addFriend(friend1, friend2, friend2NameSurname, heartId) {
    changeElementClass(heartId, 'fa-heart-o', 'fa-heart');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('not found')
            } else if (this.status === 403) {
                showWarningModal(friend2 + ' is already a friend of ' + friend1);
            } else if (this.status === 200) {
                showSuccessModal(friend2NameSurname + ' has been successfully added to friends');
            }
        }
    }

    var addFriendUrl = HOME_PAGE + "/users/friends/" + friend1 + "/" + friend2;
    xhttp.open("POST", addFriendUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function removeFriend(friend1, friend2, friend2NameSurname, heartId) {
    changeElementClass(heartId, 'fa-heart', 'fa-heart-o');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('not found')
            } else if (this.status === 403) {
                showWarningModal(friend2 + ' is not a friend of ' + friend1);
            } else if (this.status === 200) {
                showSuccessModal(friend2NameSurname + ' has been successfully removed from friends');
            }
        }
    }

    var deleteFriendUrl = HOME_PAGE + "/users/friends/" + friend1 + "/" + friend2;
    xhttp.open("DELETE", deleteFriendUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}
