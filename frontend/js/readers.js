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

                let html = '<span class="text-muted">City: ' + notNull(detail.city) + '</span><br/>\n';
                if (detail.fbPage != null) {
                    html +=
                        '<span class="text-muted">Facebook: </span>' +
                        '    <a href=' + detail.fbPage + ' target="_blank" class="underline">view</a></h5>\n';
                }

                html += '<h5><a href="#" class="right-sidebar-toggle"\n' +
                    '    onclick="openConversation(' + detail.id + ',\'' + nameSurname + '\');"\n' +
                    '    data-sidebar-id="main-right-sidebar"><i class="fa fa-envelope"></i></a></h5>';
                setPageSubtitle(html);
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

    let getOwnBooksUrl = HOME_PAGE + "/books/owner/" + readerId;
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
