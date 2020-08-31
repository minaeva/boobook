const validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
const validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
const NO_IMAGE = 'images/book-placeholder.png';

function validateBook(book_title, author_name, author_surname, year) {
    return validateField(book_title, "Title cannot be blank") &&
        validateField(author_name, "Author Name cannot be blank") &&
        validateField(author_surname, "Author Surname cannot be blank") &&
        validateYear(year, "Year should be a number greater than 1800 and less than current year");
}

function saveBook() {
    let book_title = document.getElementById("book_title").value;
    let author_name = document.getElementById("author_name").value;
    let author_surname = document.getElementById("author_surname").value;
    let publisher = document.getElementById("publisher").value;
    let cover = stringToBoolean(document.getElementById("cover").value);
    let illustrations = document.getElementById("illustrations").value;
    let age_group = document.getElementById("age_group").value;
    let year = document.getElementById("year").value;
    let language = document.getElementById("language").value;
    let pages_quantity = document.getElementById("pages_quantity").value;
    let description = document.getElementById("description").value;

    if (!validateBook(book_title, author_name, author_surname, year)) {
        return false;
    }

    if (!validateImages()) {
        return false;
    }

    let filesToUpload = document.getElementById("file_to_upload");
    let allFiles = [];
    let length = filesToUpload.files.length;
    for (let i = 0; i < length; i++) {
        allFiles[i] = filesToUpload.files[i];
    }
    console.log(allFiles);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 500) {
                closeAddBookModal();
                showWarningModal("Book " + book_title + " cannot be added");
                return false;
            } else if (this.status === 200) {
                let response = JSON.parse(this.responseText);
                let bookId = response.id;
                console.log(allFiles);
                uploadImages(allFiles, bookId);
                closeAddBookModal();
                showSuccessModal("Book " + book_title + " was successfully added");
                showOwnersBooks();
            }
        }
    };

    let requestUrl = HOME_PAGE + "/books";
    let currentUserId = getCurrentUserId();

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

function editBook() {
    let book_id = document.getElementById("edit_book_id").value;
    let book_title = document.getElementById("edit_book_title").value;
    let author_name = document.getElementById("edit_author_name").value;
    let author_surname = document.getElementById("edit_author_surname").value;
    let publisher = document.getElementById("edit_publisher").value;
    let cover = stringToBoolean(document.getElementById("edit_cover").value);
    let illustrations = document.getElementById("edit_illustrations").value;
    let age_group = document.getElementById("edit_age_group").value;
    let year = document.getElementById("edit_year").value;
    let language = document.getElementById("edit_language").value;
    let pages_quantity = document.getElementById("edit_pages_quantity").value;
    let description = document.getElementById("edit_description").value;

    let res = validateBook(book_title, author_name, author_surname, year);

    if (res) {
        closeEditBookModal();

        let xhr = new XMLHttpRequest();
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

        let requestUrl = HOME_PAGE + "/books";
        let currentUserId = getCurrentUserId();

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
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set inactive');
            }
        }
    }
    let setInactiveUrl = HOME_PAGE + "/books/setInactive/" + bookId;
    xhttp.open("POST", setInactiveUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function setActive(bookId) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set active');
            }
        }
    }
    let setActiveUrl = HOME_PAGE + "/books/setActive/" + bookId;
    xhttp.open("POST", setActiveUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function openAddBookModal() {
    $('#addBookModal').modal('show');

    let fileButton = document.getElementById("fileButton"),
        fileInput = document.getElementById("fileInput");

    fileButton.addEventListener("click", function (e) {
        if (fileInput) {
            fileInput.click();
        }
        e.preventDefault();
    }, false);

    let src0 = document.getElementById("src0");
    let target0 = document.getElementById("target0");
    showImage(src0, target0);

    let src1 = document.getElementById("src1");
    let target1 = document.getElementById("target1");
    showImage(src1, target1);

    let src2 = document.getElementById("src2");
    let target2 = document.getElementById("target2");
    showImage(src2, target2);

    let src3 = document.getElementById("src3");
    let target3 = document.getElementById("target3");
    showImage(src3, target3);

    let src4 = document.getElementById("src4");
    let target4 = document.getElementById("target4");
    showImage(src4, target4);

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
    document.getElementById("file_to_upload").value = '';
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
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                let html =
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
                let books = JSON.parse(this.responseText);
                let html = '';
                for (let i = 0; i < books.length; i++) {
                    let book = books[i];
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

    let getAllBooksUrl = HOME_PAGE + "/books";
    xhttp.open("GET", getAllBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

function showOwnersBooks() {
    setPageTitle('My Books');
    setPageSubtitle('');

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                let subHeader =
                    '<br/><h4 class="panel-title">So far you do not have any book added </h4>\n' +
                    '     <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">Add book</button>\n';
                setPageSubtitle(subHeader);

            } else if (this.status === 200) {
                let books = JSON.parse(this.responseText);
                let html = '';
                for (let i = 0; i < books.length; i++) {
                    let book = books[i];
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

    let getOwnBooksUrl = HOME_PAGE + "/books/owner/" + getCurrentUserId();
    xhttp.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}

// BOOK DETAILS
function showBookDetails(bookId, ownerId) {
    let xhttp = new XMLHttpRequest();
    let html = '';

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);
                if (bookDetails.active) {
                    html += '<div class="panel-body">\n';
                } else {
                    html += '<div class="panel-body inactive">\n' +
                        '<h5 class="text-muted strong">INACTIVE</h5>';
                }
                let coverValue = parseHardCover(bookDetails.hardCover);
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
            let collapsed = document.getElementById("collapse" + bookId);
            collapsed.innerHTML = html;
        }
    }

    let requestUrl = HOME_PAGE + "/books/" + bookId;
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

function showImage(src, target) {
    let fr = new FileReader();
    fr.onload = function (e) {
        target.src = this.result;
    };
    src.addEventListener("change", function () {
        fr.readAsDataURL(src.files[0]);
    });
}

function uploadImages(filesToUpload, bookId) {
    let formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
        formData.append('files', filesToUpload[i]);
    }
    formData.append('bookId', bookId);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 500) {
                showWarningModal("When adding the image, there is a server error");
                return false;
            } else if (this.status == 403) {
                showWarningModal("When adding the image, there is a problem with authentication");
                return false;
            } else if (this.status == 200) {
                console.log("Image added!");
            }
        }
    };

    let requestUrl = HOME_PAGE + "/images/upload";
    console.log(requestUrl);

    xhr.open("POST", requestUrl);
    addAuthorization(xhr);
    xhr.send(formData);
}

function validateImages() {
    let filesToUpload = document.getElementById("file_to_upload");
    if (filesToUpload === '') {
        return true;
    }
    if (parseInt(filesToUpload.files.length) > 5) {
        showWarningModal("Please select not more that 5 files");
        return false;
    }

    for (let i = 0; i < filesToUpload.files.length; i++) {
        let oneFile = filesToUpload.files[i];
        if (!validImageTypes.includes(oneFile.type)) {
            showWarningModal("Sorry, file type " + oneFile.type + " is invalid, allowed extensions are: " + validFileExtensions.join(", "));
            return false;
        }
    }
    return true;
}

function getImages(bookId) {
    let token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiZXp6dWJpayIsImV4cCI6MTYwMDExNzIwMH0.FP9JTOJ_Pu5tWpJVca2kfvTN3IIPJIfc-I58gxaMBx9orzztBnPTjGUBSAC2xmmr5yszLPu4irA_UzJiB8Z26w';
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;

            for (let i = 0; i < size; i++) {
                let base64 = list[i];
                let id = 'img' + i;
                let img = document.getElementById(id);
                img.src = "data:image/png;base64," + base64;

            }
        }
    }
    let url = HOME_PAGE + "/images/" + bookId;
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();

    return false;
}

