function getOwnersBooks() {
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
                document.getElementById("inbox-messages").innerHTML = html;
            } else if (this.status == 200) {
                var books = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    html = html +
                        '<div class="card">\n' +
                        '    <div class="card-content">\n' +
                        '        <div class="msg-header">\n' +
                        '            <span class="msg-from"><small>Author: ' + book.authorName + ' ' + book.authorSurname + '</small></span>\n' +
                        '            <span class="msg-timestamp"></span>\n' +
                        '            <span class="msg-attachment"><i class="fa fa-paperclip"></i></span>\n' +
                        '        </div>\n' +
                        '        <div class="msg-subject">\n' +
                        '            <span class="msg-subject"><strong id="fake-subject-1">Title: ' + book.title + '</strong></span>\n' +
                        '        </div>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("inbox-messages").innerHTML = html;
            }
        }
    }

    var tokenData = localStorage.getItem('tokenData');
    var jsonInside = JSON.parse(tokenData);
    var getOwnBooksUrl = "http://localhost:8008/books/owner/" + jsonInside.id;
    xhttp.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

