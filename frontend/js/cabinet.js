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
            if (this.readyState == 4) {
                if (this.status == 500) {
                    showWarningModal("Book " + book_title + " cannot be added");
                    return false;
                } else if (this.status == 200) {
                    showSuccessModal("Book " + book_title + " was successfully added");
                    showOwnersBooks();
                }
            }
        };

        var requestUrl = HOME_PAGE + "/books";
        var currentUserId = getCurrentUserId();

        var is_hard_cover;
        if (cover == 'hard') {
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
    if (str == null || str == "0") {
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                showWarningModal("Reader details for reader with id " + readerId + " cannot be found");
                return false;
            } else if (this.status == 200) {
                var detail = JSON.parse(this.responseText);
                console.log(detail);
                setPageTitle(notNull(detail.name) + ' ' + notNull(detail.surname));

                var html = '<span class="text-muted">City: ' + notNull(detail.city) + '</span><br/>\n' +
                    '<span class="text-muted">Facebook: </span>';
                if (detail.fbPage != null) {
                    html += '<a href=' + detail.fbPage + ' target="_blank"><i class="fa fa-facebook-square"></i></a>\n';
                }
                setPageSubtitle(html);
            }
        }
    }

    var getReaderByIdUrl = HOME_PAGE + "/users/" + readerId;
    xhttp.open("GET", getReaderByIdUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function openReaderPage(readerId) {
    if (readerId != getCurrentUserId()) {
        selectMenu("menu_readers");
        showReaderDetails(readerId);
    } else {
        selectMenu("menu_home");
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                showWarningModal("Cannot find details for the reader");
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = ' ';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    var cardId = "book-card-" + i;
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

function showAllBooks() {
    selectMenu("menu_books", 'Books');

    var header = document.getElementById("accordion_header");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                header.innerHTML +=
                    '    <br/><h4 class="panel-title">\n' +
                    '    So far, there is not any book in db. Fortunately you can be the first one!' +
                    '    </h4>\n' +
                    '  <div class="panel panel-white">\n' +
                    '        <div class="panel-body">\n' +
                    '            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">' +
                    '               Add your first book</button>\n' +
                    '        </div>\n' +
                    '    </div>\n';

            } else if (this.status == 200) {
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

        if (this.readyState == 4) {
            if (this.status == 404) {
                header.innerHTML +=
                    '    <br/><h4 class="panel-title">\n' +
                    'So far, you do not have any book added' +
                    '    </h4>\n' +
                    '  <div class="panel panel-white">\n' +
                    '        <div class="panel-body">\n' +
                    '            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">Add book</button>\n' +
                    '        </div>\n' +
                    '    </div>\n';
            } else if (this.status == 200) {
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
    if (hard_cover == true) {
        return "hard";
    } else {
        return "soft";
    }
}

function showBookDetails(bookId, ownerId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);
                var html =
                    '<div class="panel-body">\n' +
                    '<h5><span class="text-muted"> Publisher: </span>' + notNull(bookDetails.publisher) + '</h5>' +

                    '<h5><span class="text-muted"> Language: </span>' + bookDetails.language + '</span>' +
                    '<span style="float:right;"><span class="text-muted">Year: </span>' + notNull(bookDetails.year) + '</span></h5>' +

                    '<h5><span class="text-muted"> Cover: </span>' + parseHardCover(bookDetails.cover) +
                    '<span style="float:right;"><span class="text-muted"> Illustrations: </span>' + parseIllustrations(bookDetails.illustrations) + '</span></h5>' +

                    '<h5><span class="text-muted"> Age group: </span>' + parseAgeGroup(bookDetails.ageGroup) +
                    '<span style="float:right;"><span class="text-muted"> Pages: </span>' + notNull(bookDetails.pagesQuantity) + '</span></h5>' +

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
