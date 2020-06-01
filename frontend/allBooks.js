function getAllBooks() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var books = JSON.parse(this.responseText);
            var html = '<tr>\n' +
                '        <th>Title</th>\n' +
                '        <th>Author</th>\n' +
                '        <th>Owner</th>\n' +
                '    </tr>';
            for (var i = 0; i < books.length; i++) {
                var book = books[i];
                console.log(book);
                html = html + '<tr><td>' + book.title + '</td>\n' +
                    '        <td>' + book.authorName + '</td>\n' +
                    '        <td>' + book.ownerName + '</td>\n' +
                    '        </tr>';

            }
            document.getElementById("booksList").innerHTML = html;
        }
    };
    xhttp.open("GET", "http://localhost:8008/books", true);
    xhttp.send();
}