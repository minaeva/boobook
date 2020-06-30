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

// function selectCard(cardToSelect) {
//     var selected = document.getElementsByClassName("card active");
//     if (selected.length > 0) {
//         selected[0].className = selected[0].className.replace(" active", "");
//     }
//     cardToSelect.className += " active";
//     return false;
// }


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

function showReaderDetails(readerId) {
    // var header = document.getElementById("main-list-header");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            var headerDiv = document.getElementById("main-list-header");
            if (this.status == 404) {
                headerDiv.innerHTML = 'error';
            } else if (this.status == 200) {
                var detail = JSON.parse(this.responseText);
                console.log(detail);
                var html = '<h4>Reader: <strong>' + notNull(detail.name) + ' ' + notNull(detail.surname) + '</strong></h4>';
                    // '<div class="card"><div class="card-content"><div class="msg-subject"><span class="msg-subject"> Reader: <strong>' + notNull(detail.name) + ' ' + notNull(detail.surname) + '</strong></span></div>\n';
                html += '<h4 class="panel-title"> City: ' + notNull(detail.city) + '</h4>\n';
                html += '<div class="msg-header"><span class="msg-subject"> Facebook: <a href=' + detail.fbPage + '>' + notNull(detail.fbPage) + '</a></span></div></div></div>\n';
                headerDiv.innerHTML = html;
                // showReaderDetailsSection();
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
        selectMenu("menu-readers");
        showReaderDetails(readerId);
    } else {
        selectMenu("menu-home");
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                showWarningModal("Cannot find details for the reader");
                // document.getElementById("main-window").innerHTML = 'error';
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = ' ';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    var cardId = "book-card-" + i;
                    html = html +
                        '<div class="card" id="' + cardId + '" onclick="showBookDetails(' + book.id + ', ' + book.ownerId +
                        '); return false">\n' +
                        '    <div class="card-content">\n' +
                        '        <div class="msg-subject">\n' +
                        '            <span class="msg-subject"><strong> ' + book.title + '</strong></span>\n' +
                        '        </div>\n' +
                        '        <div class="msg-header">\n' +
                        '            <span class="msg-subject"><small>by</small></span>\n' +
                        '            <span class="msg-subject">' + book.authorName + ' ' + book.authorSurname + '</span>\n' +
                        '            <span class="msg-timestamp"></span>\n' +
                        '            <span class="msg-attachment"><i class="fa fa-edit"></i></span>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("main-list-header").innerHTML = html;
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
    selectMenu("menu-books", 'Books');

    var header = document.getElementById("main-list-header");

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
                    '            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">'+
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
    var header = document.getElementById("main-list-header");
    header.innerHTML = '<h4>My Books</h4>\n';

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
                    '<h5> <span class="text-muted">Year: </span>' + notNull(bookDetails.year) + '</h5>' +
                    '<h5><span class="text-muted"> Publisher: </span>' + notNull(bookDetails.publisher) + '</h5>' +
                    '<h5><span class="text-muted"> Age group: </span>' + parseAgeGroup(bookDetails.ageGroup) + '</h5>' +
                    '<h5><span class="text-muted"> Cover: </span>' + parseHardCover(bookDetails.cover) + '</h5>' +
                    '<h5><span class="text-muted"> Language: </span>' + bookDetails.language + '</h5>' +
                    '<h5><span class="text-muted"> Illustrations: </span>' + parseIllustrations(bookDetails.illustrations) + '</h5>' +
                    '<h5><span class="text-muted"> Pages: </span>' + notNull(bookDetails.pagesQuantity) + '</h5>' +
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

