function openCreateBookModalWindow() {
    var element = document.getElementById("create-book-modal-window");
    element.classList.add("is-active");
    document.getElementById("book-title").focus();
    return false;
}

function closeCreateBookModalWindow() {
    var element = document.getElementById("create-book-modal-window");
    element.classList.remove("is-active");
    return false;
}

function saveBook() {
    var book_title = document.getElementById("book-title").value;
    var author_name = document.getElementById("author-name").value;
    var author_surname = document.getElementById("author-surname").value;

    if (validateBook(book_title, author_name, author_surname)) {
        closeCreateBookModalWindow();
        document.getElementById("book-title").value = '';
        document.getElementById("author-name").value = '';
        document.getElementById("author-surname").value = '';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if (this.readyState == 4) {
                if (this.status == 404) {
                    swal({
                        title: "Book " + book_title,
                        text: "cannot be added",
                        icon: "warning",
                        button: "let's try another",
                    });
                    return false;
                } else if (this.status == 200) {
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
            "ownerId": currentUserId
        };

        xhr.open("POST", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        addAuthorization(xhr);
        xhr.send(JSON.stringify(requestBody));

        return false;
    }
}

function validateBook(book_title, author_name, author_surname) {
    if (book_title == null || book_title == "") {
        swal({
            title: "Title",
            text: "can't be blank",
            icon: "warning",
            button: "let's fix it",
        });
        return false;
    } else if (author_name == null || author_name == "") {
        swal({
            title: "Author name",
            text: "can't be blank",
            icon: "warning",
            button: "let's fix it",
        });
        return false;
    } else if (author_surname == null || author_surname == "") {
        swal({
            title: "Author surname",
            text: "can't be blank",
            icon: "warning",
            button: "let's fix it",
        });
        return false;
    }
    return true;
}

function selectCard(cardToSelect) {
    var selected = document.getElementsByClassName("card active");
    if (selected.length > 0) {
        selected[0].className = selected[0].className.replace(" active", "");
    }
    cardToSelect.className += " active";
    return false;
}

function hideRightPane() {
    var rightPane = document.getElementById("right-pane");
    rightPane.classList.add("is-hidden");
}

function showRightPane() {
    var rightPane = document.getElementById("right-pane");
    rightPane.className = rightPane.className.replace("is-hidden", "");
}

function showBookDetails(id, bookId, ownerId) {
    selectCard(id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);
                var html = '            <div class="top">\n' +
                    '                <div class="avatar">\n' +
                    '                    <img src="https://placehold.it/128x128">\n' +
                    '                </div>\n' +
                    '                <div class="book-detail">\n' +
                    '                    <div class="title">' + bookDetails.title + '</div>\n' +
                    '                    <div class="author">' + notNull(bookDetails.authorName) +
                    ' ' + notNull(bookDetails.authorSurname) + '</div>\n' +
                    '                </div>\n' +
                    '                <hr>\n' +
                    '                <div class="content">\n owner: <a class="owner" id="book-details-owner" onclick="openReaderPage(' + ownerId +
                    '); return false">' + notNull(bookDetails.ownerName) +
                    '                </a></div>\n' +
                    '            </div>\n'
            }
            showRightPane();
            document.getElementById("right-pane").innerHTML = html;
        }
    }

    var requestUrl = HOME_PAGE + "/books/" + bookId;

    xhttp.open("GET", requestUrl);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function selectMenu(menuToSelect) {
    var selected = document.getElementsByClassName("menu active");
    if (selected.length > 0) {
        selected[0].className = selected[0].className.replace(" active", "");
    }

    var toSelect = document.getElementById(menuToSelect);
    toSelect.className += " active";
    return false;
}

function notNull(str) {
    if (str == null) {
        return '';
    }
    return str;
}

function showReaderDetailsSection() {
    var readerDetailDiv = document.getElementById("reader-detail");
    readerDetailDiv.classList.remove("is-hidden");
    return false;
}

function hideReaderDetailsSection() {
    var readerDetailDiv = document.getElementById("reader-detail");
    readerDetailDiv.classList.add("is-hidden");
    return false;
}

function showReaderDetails(readerId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            var readerDetailDiv = document.getElementById("reader-detail");
            if (this.status == 404) {
                readerDetailDiv.innerHTML = 'error';
            } else if (this.status == 200) {
                var detail = JSON.parse(this.responseText);
                console.log(detail);
                var html = '<div class="card"><div class="card-content"><div class="msg-subject"><span class="msg-subject"> Reader: <strong>' + notNull(detail.name) + ' ' + notNull(detail.surname) + '</strong></span></div>\n';
                html += '<div class="msg-header"><span class="msg-subject"> City: ' + notNull(detail.city) + '</span></div>\n';
                html += '<div class="msg-header"><span class="msg-subject"> Facebook: <a href=' + detail.fbPage + '>' + notNull(detail.fbPage) + '</a></span></div></div></div>\n';
                readerDetailDiv.innerHTML = html;
                showReaderDetailsSection();
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
                document.getElementById("main-window").innerHTML = 'error';
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = ' ';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    var cardId = "book-card-" + i;
                    html = html +
                        '<div class="card" id="' + cardId + '" onclick="showBookDetails(this, ' + book.id + ', ' + book.ownerId +
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
                document.getElementById("main-window").innerHTML = html;
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
    hideRightPane();
    hideReaderDetailsSection();
    selectMenu("menu-search");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                var html = '<div class="card">\n' +
                    '    <div class="card-content">\n' +
                    '        <div class="msg-header">\n' +
                    '            <span class="msg-from">So far, there is not any book in db. Fortunately you can be the first one! </span><br/><br/>\n' +
                    '                <a class="button is-light is-block is-bold" id="add-first-book-button" ' +
                    '                       onclick="openCreateBookModalWindow(); return false">\n' +
                    '                    <span class="compose">Add your first book</span>\n' +
                    '                </a>\n   ' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>\n';
                document.getElementById("main-window").innerHTML = html;
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    var cardId = "book-card-" + i;
                    html = html +
                        '<div class="card" id="' + cardId + '" onclick="showBookDetails(this, ' + book.id + ', ' + book.ownerId +
                        '); return false">\n' +
                        '    <div class="card-content">\n' +
                        '        <div class="msg-subject">\n' +
                        '            <span class="msg-subject"><strong> ' + book.title + '</strong></span>\n' +
                        '        </div>\n' +
                        '        <div class="msg-header">\n' +
                        '            <span class="msg-subject"><small>by</small></span>\n' +
                        '            <span class="msg-subject">' + book.authorName + ' ' + book.authorSurname + '</span>\n' +
                        '            <span class="msg-timestamp"></span>\n' +
                        '            <span class="msg-attachment"><i class="fa fa-heart-o"></i></span>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("main-window").innerHTML = html;
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
    hideRightPane();
    hideReaderDetailsSection();
    selectMenu("menu-home");
    var readerDetailDiv = document.getElementById("reader-detail");
    readerDetailDiv.classList.add("is-hidden");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            if (this.status == 404) {
                var html = '<div class="card">\n' +
                    '    <div class="card-content">\n' +
                    '        <div class="msg-header">\n' +
                    '            <span class="msg-from">So far, you do not have any book added</span><br/><br/>\n' +
                    '                <a class="button is-light is-block is-bold" id="add-first-book-button" ' +
                    '                       onclick="openCreateBookModalWindow(); return false">\n' +
                    '                    <span class="compose">Add your first book</span>\n' +
                    '                </a>\n   ' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>\n';
                document.getElementById("main-window").innerHTML = html;
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    console.log(book);
                    var cardId = "book-card-" + i;
                    html = html +
                        '<div class="card" id="' + cardId + '" onclick="showBookDetails(this, ' + book.id + ', ' + book.ownerId +
                        '); return false">\n' +
                        '    <div class="card-content">\n' +
                        '        <div class="msg-subject">\n' +
                        '            <span class="msg-subject"><strong> ' + book.title + '</strong></span>\n' +
                        '        </div>\n' +
                        '        <div class="msg-header">\n' +
                        '            <span class="msg-subject"><small>by</small></span>\n' +
                        '            <span class="msg-subject">' + book.authorName + ' ' + book.authorSurname + '</span>\n' +
                        '            <span class="msg-timestamp"></span>\n' +
                        '            <span class="msg-attachment"><i class="fa fa-edit"></i>&nbsp;</span>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("main-window").innerHTML = html;
            }
        }
    }

    var getOwnBooksUrl = HOME_PAGE + "/books/owner/" + getCurrentUserId();
    xhttp.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

