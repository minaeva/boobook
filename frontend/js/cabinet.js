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
    var book_title = document.getElementById("book_title").value;
    var author_name = document.getElementById("author_name").value;
    var author_surname = document.getElementById("author_surname").value;

    if (validateBook(book_title, author_name, author_surname)) {
        closeCreateBookModalWindow();
        document.getElementById("book_title").value = '';
        document.getElementById("author_name").value = '';
        document.getElementById("author_surname").value = '';

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
                    getOwnersBooks();
                }
            }
        };

        var tokenData = localStorage.getItem('tokenData');
        var jsonInside = JSON.parse(tokenData);
        var requestUrl = "http://localhost:8008/books";

        const requestBody = {
            "title": book_title,
            "authorName": author_name,
            "authorSurname": author_surname,
            "ownerId": jsonInside.id
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

