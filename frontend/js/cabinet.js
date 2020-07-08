function closeAddBookModal() {
    $('#addBookModal').modal('hide');
    document.getElementById("book_title").value = '';
    document.getElementById("author_name").value = '';
    document.getElementById("author_surname").value = '';
    document.getElementById("publisher").value = '';
    document.getElementById("year").value = '';
    document.getElementById("pages_quantity").value = '';
    document.getElementById("description").value = '';
    return false;
}

function saveBook() {
    var book_title = document.getElementById("book_title").value;
    var author_name = document.getElementById("author_name").value;
    var author_surname = document.getElementById("author_surname").value;
    var publisher = document.getElementById("publisher").value;
    var cover = document.getElementById("cover").value;
    var illustrations = document.getElementById("illustrations").value;
    var age_group = document.getElementById("age_group").value;
    var year = document.getElementById("year").value;
    var language = document.getElementById("language").value;
    var pages_quantity = document.getElementById("pages_quantity").value;
    var description = document.getElementById("description").value;

    var res = validateBook(book_title, author_name, author_surname, year);

    if (res) {
        closeAddBookModal();

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 500) {
                    showWarningModal("Book " + book_title + " cannot be added");
                    return false;
                } else if (this.status === 200) {
                    showSuccessModal("Book " + book_title + " was successfully added");
                    showOwnersBooks();
                }
            }
        };

        var requestUrl = HOME_PAGE + "/books";
        var currentUserId = getCurrentUserId();

        var is_hard_cover;
        if (cover === 'hard') {
            is_hard_cover = true;
        } else
            is_hard_cover = false;

        const requestBody = {
            "title": book_title,
            "authorName": author_name,
            "authorSurname": author_surname,
            "ownerId": currentUserId,
            "year": year,
            "publisher": publisher,
            "ageGroup": age_group,
            "isHardCover": is_hard_cover,
            "language": language,
            "illustrations": illustrations,
            "pagesQuantity": pages_quantity,
            "description": description,
        };
        console.log(requestBody);

        xhr.open("POST", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        addAuthorization(xhr);
        xhr.send(JSON.stringify(requestBody));

        return false;
    }
}

function validateBook(book_title, author_name, author_surname, year) {
    return validateField(book_title, "Title cannot be blank") &&
        validateField(author_name, "Author Name cannot be blank") &&
        validateField(author_surname, "Author Surname cannot be blank") &&
        validateYear(year, "Year should be a number greater than 1800 and less than current year");
}

function notNull(str) {
    if (str === null || str === "0") {
        return '';
    }
    return str;
}

function setPageTitle(text) {
    var header = document.getElementById("accordion_header");
    header.innerHTML = text;
}

function setPageSubtitle(text) {
    var subHeader = document.getElementById("accordion_subheader");
    subHeader.innerHTML = text;
}

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

function showAllBooks() {
    selectMenu("menu_books", 'Books');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                var html =
                    '    <br/><h4 class="panel-title">\n' +
                    '    So far, there is not any book in db. Fortunately you can be the first one!' +
                    '    </h4>\n' +
                    '  <div class="panel panel-white">\n' +
                    '        <div class="panel-body">\n' +
                    '            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">' +
                    '               Add your first book</button>\n' +
                    '        </div>\n' +
                    '    </div>\n';
                setPageTitle(html);
            } else if (this.status === 200) {
                var books = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + book.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="showBookDetails(' + book.id + ', ' + book.ownerId + '); return false;" data-parent="#accordion" href="#collapse' + book.id + '"\n' +
                        '               aria-expanded="true" aria-controls="collapse' + book.id + '">\n' + book.title +
                        '            <h5 class="text-muted"> by ' + book.authorName + ' ' + book.authorSurname + '</h5>\n' +
                        '            </a>\n' +
                        '        </h4>\n' +
                        '    </div>\n' +
                        '    <div id="collapse' + book.id + '" class="panel-collapse collapse" role="tabpanel"\n' +
                        '         aria-labelledby="heading' + book.id + '">\n' +
                        '    </div>\n' +
                        '</div>'
                }
                document.getElementById("accordion").innerHTML = html;
            }
        }
    }

    var getAllBooksUrl = HOME_PAGE + "/books";
    xhttp.open("GET", getAllBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function showOwnersBooks() {
    setPageTitle('My Books');
    setPageSubtitle('');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                var subHeader =
                    '<br/><h4 class="panel-title">So far you do not have any book added </h4>\n' +
                    '     <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">Add book</button>\n';
                setPageSubtitle(subHeader);

            } else if (this.status === 200) {
                var books = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    html = html +
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

    var getOwnBooksUrl = HOME_PAGE + "/books/owner/" + getCurrentUserId();
    xhttp.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function parseAgeGroup(age_group) {
    switch (age_group) {
        case 0:
            return "baby";
        case 1:
            return "preschool";
        case 2:
            return "junior school";
        case 3:
            return "middle school";
        case 4:
            return "aduld";
        default:
            "non specified";
    }
}

function parseIllustrations(illustrations) {
    switch (illustrations) {
        case 0:
            return "absent";
        case 1:
            return "black and white";
        case 2:
            return "color";
        default:
            "non specified";
    }
}

function parseHardCover(hard_cover) {
    if (hard_cover === true) {
        return "hard";
    } else {
        return "soft";
    }
}

function showBookDetails(bookId, ownerId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);
                var html =
                    '<div class="panel-body">\n' +
                    '<h5><span class="text-muted"> Publisher: </span>' + notNull(bookDetails.publisher) + '</h5>' +

                    '<h5><span class="text-muted"> Language: </span>' + bookDetails.language + '</h5>' +
                    '<h5><span class="text-muted">Year: </span>' + notNull(bookDetails.year) + '</h5>' +

                    '<h5><span class="text-muted">Cover: </span>' + parseHardCover(bookDetails.cover) + '</h5>' +
                    '<h5><span class="text-muted">Illustrations: </span>' + parseIllustrations(bookDetails.illustrations) + '</h5>' +

                    '<h5><span class="text-muted">Age group: </span>' + parseAgeGroup(bookDetails.ageGroup) + '</h5>'
                '<h5><span class="text-muted">Pages: </span>' + notNull(bookDetails.pagesQuantity) + '</h5>' +

                '<h5><span class="text-muted"> Description: </span>' + notNull(bookDetails.description) + '</h5>';

                if (bookDetails.ownerId != getCurrentUserId()) {
                    html += '  <hr>\n' +
                        '  <div class="content">\n owner: <a class="underlined" id="book-details-owner" onclick="openReaderPage(' + ownerId +
                        '); return false;">' + notNull(bookDetails.ownerName) +
                        '</a></div>\n';
                }
                html += '  </div>\n';
            }
            var collapsed = document.getElementById("collapse" + bookId);
            collapsed.innerHTML = html;
        }
    }

    var requestUrl = HOME_PAGE + "/books/" + bookId;
    xhttp.open("GET", requestUrl);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function clickHome() {
    selectMenu("menu_home", 'My Books');
    showOwnersBooks();
}

function clickBooks() {
    showAllBooks();
}

function clickReaders() {
    showAllReaders();
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

function clickFavoriteReaders() {
    selectMenu('menu_favorite_readers', 'My favorite readers');
    setPageSubtitle('');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (404 === this.status) {
                showWarningModal('Not any friend added yet. Click on <i class="fa fa-heart-o"></i> icon next to any reader')
            } else if (200 === this.status) {
                var readers = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < readers.length; i++) {
                    var reader = readers[i];
                    console.log(reader);
                    var heartId = 'heart' + reader.id;

                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="openReaderPage(' + reader.id +
                        '); return false;" data-parent="#accordion" href="#collapse' + reader.id + '"\n' +
                        '               aria-expanded="true" aria-controls="collapse' + reader.id + '">\n';
                    var nameSurname = notNull(reader.name) + ' ' + notNull(reader.surname);
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

    var getFriendsUrl = HOME_PAGE + "/users/friends/" + getCurrentUserId();
    console.log(getFriendsUrl);
    xhttp.open("GET", getFriendsUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}
