function validateBook(book_title, author_name, author_surname, year) {
    return validateField(book_title, "Title cannot be blank") &&
        validateField(author_name, "Author Name cannot be blank") &&
        validateField(author_surname, "Author Surname cannot be blank") &&
        validateYear(year, "Year should be a number greater than 1800 and less than current year");
}

function saveBook() {
    var book_title = document.getElementById("book_title").value;
    var author_name = document.getElementById("author_name").value;
    var author_surname = document.getElementById("author_surname").value;
    var publisher = document.getElementById("publisher").value;
    var cover = stringToBoolean(document.getElementById("cover").value);
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

        const requestBody = {
            "title": book_title,
            "authorName": author_name,
            "authorSurname": author_surname,
            "ownerId": currentUserId,
            "year": year,
            "publisher": publisher,
            "ageGroup": age_group,
            "hardCover": cover,
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

function editBook() {
    var book_id = document.getElementById("edit_book_id").value;
    var book_title = document.getElementById("edit_book_title").value;
    var author_name = document.getElementById("edit_author_name").value;
    var author_surname = document.getElementById("edit_author_surname").value;
    var publisher = document.getElementById("edit_publisher").value;
    var cover = stringToBoolean(document.getElementById("edit_cover").value);
    var illustrations = document.getElementById("edit_illustrations").value;
    var age_group = document.getElementById("edit_age_group").value;
    var year = document.getElementById("edit_year").value;
    var language = document.getElementById("edit_language").value;
    var pages_quantity = document.getElementById("edit_pages_quantity").value;
    var description = document.getElementById("edit_description").value;

    var res = validateBook(book_title, author_name, author_surname, year);

    if (res) {
        closeEditBookModal();

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 500) {
                    showWarningModal("Book " + book_title + " cannot be edited");
                    return false;
                } else if (this.status === 200) {
                    showSuccessModal("Book " + book_title + " was successfully edited");
                    showOwnersBooks();
                }
            }
        };

        var requestUrl = HOME_PAGE + "/books";
        var currentUserId = getCurrentUserId();

        const requestBody = {
            "id": book_id,
            "title": book_title,
            "authorName": author_name,
            "authorSurname": author_surname,
            "ownerId": currentUserId,
            "year": year,
            "publisher": publisher,
            "ageGroup": age_group,
            "hardCover": cover,
            "language": language,
            "illustrations": illustrations,
            "pagesQuantity": pages_quantity,
            "description": description,
        };
        console.log(requestBody);

        xhr.open("PUT", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        addAuthorization(xhr);
        xhr.send(JSON.stringify(requestBody));

        return false;
    }
}

function setInactive(bookId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set inactive');
            }
        }
    }
    var setInactiveUrl = HOME_PAGE + "/books/setInactive/" + bookId;
    xhttp.open("POST", setInactiveUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function setActive(bookId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set active');
            }
        }
    }
    var setActiveUrl = HOME_PAGE + "/books/setActive/" + bookId;
    xhttp.open("POST", setActiveUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

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

function openEditModal(book_id, title, authorName, authorSurname, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description) {
    $('#editBookModal').modal('show');
    console.log(title, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description);
    document.getElementById("edit_book_id").value = book_id;
    document.getElementById("edit_book_title").value = title;
    document.getElementById("edit_author_name").value = authorName;
    document.getElementById("edit_author_surname").value = authorSurname;
    document.getElementById("edit_publisher").value = publisher;
    document.getElementById("edit_language").value = language;
    document.getElementById("edit_year").value = year;
    document.getElementById("edit_cover").value = cover;
    document.getElementById("edit_illustrations").value = illustrations;
    document.getElementById("edit_age_group").value = ageGroup;
    document.getElementById("edit_pages_quantity").value = pagesQuantity;
    document.getElementById("edit_description").value = description;

    return false;
}

function closeEditBookModal() {
    $('#editBookModal').modal('hide');
    document.getElementById("edit_book_title").value = '';
    document.getElementById("edit_author_name").value = '';
    document.getElementById("edit_author_surname").value = '';
    document.getElementById("edit_publisher").value = '';
    document.getElementById("edit_year").value = '';
    document.getElementById("edit_pages_quantity").value = '';
    document.getElementById("edit_description").value = '';
    return false;
}

function showAllBooks() {
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

// BOOK DETAILS
function showBookDetails(bookId, ownerId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);
                var html = '';
                if (bookDetails.active) {
                    html += '<div class="panel-body">\n';
                } else {
                    html += '<div class="panel-body inactive">\n' +
                    '<h5 class="text-muted strong">INACTIVE</h5>';
                }
                var coverValue = parseHardCover(bookDetails.hardCover);
                html +=
                    '<h5><span class="text-muted">Publisher: </span>' + notNull(bookDetails.publisher) + '</h5>' +

                    '<h5><span class="text-muted">Language: </span>' + bookDetails.language + '</h5>' +
                    '<h5><span class="text-muted">Year: </span>' + notNull(bookDetails.year) + '</h5>' +

                    '<h5><span class="text-muted">Cover: </span>' + coverValue + '</h5>' +
                    '<h5><span class="text-muted">Illustrations: </span>' + parseIllustrations(bookDetails.illustrations) + '</h5>' +

                    '<h5><span class="text-muted">Age group: </span>' + parseAgeGroup(bookDetails.ageGroup) + '</h5>' +
                    '<h5><span class="text-muted">Pages: </span>' + notNull(bookDetails.pagesQuantity) + '</h5>' +

                    '<h5><span class="text-muted">Description: </span>' + notNull(bookDetails.description) + '</h5>' +
                    '<hr>';

                if (bookDetails.ownerId != getCurrentUserId()) {
                    html +=
                        '<div class="content">\n owner: ' +
                        '<a class="underlined" id="book-details-owner" onclick="clickReader(' + ownerId + '); return false;">'
                        + notNull(bookDetails.ownerName) + '</a></div>\n';
                } else {
                    html +=
                        '<div class="btn-group" style="float: right"> ' +
                        '<button type="button" class="btn btn-default" data-toggle="modal"' +
                        'onclick="openEditModal(' + bookId + ',\'' + bookDetails.title + '\',\'' + bookDetails.authorName + '\',\'' + bookDetails.authorSurname +
                        '\',\'' + bookDetails.publisher + '\',\'' + bookDetails.language + '\',\'' + bookDetails.year +
                        '\',' + bookDetails.hardCover + ',' + bookDetails.illustrations + ',\'' + bookDetails.ageGroup +
                        '\',\'' + bookDetails.pagesQuantity + '\',\'' + bookDetails.description + '\'); ' +
                        'return false;">Edit</button>';
                    if (bookDetails.active) {
                        html +=
                            '<button type="button" class="btn btn-default" onclick="setInactive(' + bookId + '); showOwnersBooks(); return false; ">Set inactive</button></div>';
                    } else {
                        html +=
                            '<button type="button" class="btn btn-default" onclick="setActive(' + bookId + '); showOwnersBooks(); return false; ">Set active</button></div>';
                    }
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
            return "adult";
        default:
            return "non specified";
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

function stringToBoolean(val) {
    if (val === 'true') {
        return true;
    } else {
        return false;
    }

}

