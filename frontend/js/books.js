const validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
const PREVIEWS_QUANTITY = 5;
const NO_IMAGE = 'images/book-placeholder.png';
const NO_READER_IMAGE = 'reader-girl.png';
let IMAGE_EDITED;
const IMAGE_TO_SAVE = 'target';
const IMAGE_TO_EDIT = 'edit_target';


function validateBook(book_title, author_name, author_surname, year) {
    return validateField(book_title, 'book_title_group') &
        validateField(author_name, 'author_name_group') &
        validateField(author_surname, 'author_surname_group') &
        validateYear(year, 'year_group');
}

function validateEditBook(book_title, author_name, author_surname, year) {
    return validateField(book_title, 'edit_book_title_group') &
        validateField(author_name, 'edit_author_name_group') &
        validateField(author_surname, 'edit_author_surname_group') &
        validateYear(year, 'edit_year_group');
}

function saveBook() {

    let book_title = document.getElementById("book_title").value;
    let author_name = document.getElementById("author_name").value;
    let author_surname = document.getElementById("author_surname").value;
    let publisher = document.getElementById("publisher").value;
    let cover = document.getElementById("cover").value;
    let illustrations = document.getElementById("illustrations").value;
    let age_group = document.getElementById("age_group").value;
    let year = document.getElementById("year").value;
    let language = document.getElementById("language").value;
    let pages_quantity = document.getElementById("pages_quantity").value;
    let description = document.getElementById("description").value;

    if (!validateBook(book_title, author_name, author_surname, year)) {
        return false;
    }

    let allFiles;
    if (IMAGE_EDITED) {
        allFiles = retrieveImagesFromPreviews(IMAGE_TO_SAVE);
        if (!allFiles) {
            return false;
        }
    }
    closeAddBookModal();

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
                showSuccessModal("Book \'" + book_title + "\' has been successfully added");
                if (IMAGE_EDITED) {
                    saveImages(allFiles, bookId);
                }
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
        "cover": cover,
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
    let cover = document.getElementById("edit_cover").value;
    let illustrations = document.getElementById("edit_illustrations").value;
    let age_group = document.getElementById("edit_age_group").value;
    let year = notNull(document.getElementById("edit_year").value);
    let language = document.getElementById("edit_language").value;
    let pages_quantity = document.getElementById("edit_pages_quantity").value;
    let description = document.getElementById("edit_description").value;
    let active = document.getElementById("edit_book_active").value;
    let allFiles;

    if (!validateEditBook(book_title, author_name, author_surname, year)) {
        return false;
    }

    if (IMAGE_EDITED) {
        allFiles = retrieveImagesFromPreviews(IMAGE_TO_EDIT);
        if (!allFiles) {
            return false;
        }
    }

    closeEditBookModal();

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 500) {
                showWarningModal("Book " + book_title + " cannot be edited");
                return false;
            } else if (this.status === 200) {
                showSuccessModal("Book \'" + book_title + "\' has been successfully edited");
                if (IMAGE_EDITED) {
                    updateImages(allFiles, book_id);
                }
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
        "cover": cover,
        "language": language,
        "illustrations": illustrations,
        "pagesQuantity": pages_quantity,
        "description": description,
        "active": active
    };
    console.log(requestBody);

    xhr.open("PUT", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhr);
    xhr.send(JSON.stringify(requestBody));

    return false;
}

function setInactive(bookId, title) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book \'' + title + '\' has been set inactive');
                showOwnersBooks();
            }
        }
    }
    let setInactiveUrl = HOME_PAGE + "/books/setInactive/" + bookId;
    xhr.open("POST", setInactiveUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function setActive(bookId, title) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book \'' + title + '\' has been set active');
                showOwnersBooks();
            }
        }
    }
    let setActiveUrl = HOME_PAGE + "/books/setActive/" + bookId;
    xhr.open("POST", setActiveUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function openAddBookModal() {
    $('#addBookModal').modal('show');

    $('#addBookModal').on('shown.bs.modal', function () {
        $('#book_title').focus();
    })

    IMAGE_EDITED = false;

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
    showOnePreview(src0, target0);

    let src1 = document.getElementById("src1");
    let target1 = document.getElementById("target1");
    showOnePreview(src1, target1);

    let src2 = document.getElementById("src2");
    let target2 = document.getElementById("target2");
    showOnePreview(src2, target2);

    let src3 = document.getElementById("src3");
    let target3 = document.getElementById("target3");
    showOnePreview(src3, target3);

    let src4 = document.getElementById("src4");
    let target4 = document.getElementById("target4");
    showOnePreview(src4, target4);

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
    document.getElementById("language").value = 0;
    document.getElementById("cover").value = 0;
    document.getElementById("illustrations").value = 0;
    document.getElementById("age_group").value = 0;
    cleanPreviewsOnModalClose('target');
    return false;
}

function openEditBookModal(book_id, title, authorName, authorSurname, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description, active) {
    $('#editBookModal').modal('show');
    $('#editBookModal').on('shown.bs.modal', function () {
        $('#edit_book_title').focus();
    })
    IMAGE_EDITED = false;

    let fileButton = document.getElementById("edit_fileButton"),
        fileInput = document.getElementById("edit_fileInput");

    fileButton.addEventListener("click", function (e) {
        if (fileInput) {
            fileInput.click();
            IMAGE_EDITED = true;
        }
        e.preventDefault();
    }, false);

    let src0 = document.getElementById("edit_src0");
    let target0 = document.getElementById("edit_target0");
    showOnePreview(src0, target0);

    let src1 = document.getElementById("edit_src1");
    let target1 = document.getElementById("edit_target1");
    showOnePreview(src1, target1);

    let src2 = document.getElementById("edit_src2");
    let target2 = document.getElementById("edit_target2");
    showOnePreview(src2, target2);

    let src3 = document.getElementById("edit_src3");
    let target3 = document.getElementById("edit_target3");
    showOnePreview(src3, target3);

    let src4 = document.getElementById("edit_src4");
    let target4 = document.getElementById("edit_target4");
    showOnePreview(src4, target4);

    console.log(title, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description, active);
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
    document.getElementById("edit_book_active").value = active;
    showEditBookImages(book_id);
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
    cleanPreviewsOnModalClose('edit_target');
    return false;
}

function cleanPreviewsOnModalClose(classNameBase) {
    for (let i = 0; i < PREVIEWS_QUANTITY; i++) {
        let className = classNameBase + i;
        let element = document.getElementById(className);
        element.src = NO_IMAGE;
    }
}

function showSearchBooksHeader() {

    // let header = '<div>Search</div>';
    // $('#accordion_header').html(header);
    let searchForm =
        // '<div>Search</div>' +
        // '<form class="col-md-12">\n' +
        '  <div class="row">' +
        '    <div class="form-group col-md-12">\n' +
        '      <input type="text" class="form-control" id="search_title" placeholder="Title">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_author_name" placeholder="Author name">\n' +
        '    </div>\n' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_author_surname" placeholder="Author surname">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-12">\n' +
        '      <input type="text" class="form-control" id="search_city" placeholder="City">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_age_from">\n' +
        '                <option value="0">Age group from</option>\n' +
        '                <option value="1">baby</option>\n' +
        '                <option value="2">preschool</option>\n' +
        '                <option value="3">junior-school</option>\n' +
        '                <option value="4">mid-school</option>\n' +
        '                <option value="5">adult</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_age_to">\n' +
        '                <option value="0">Age group to</option>\n' +
        '                <option value="1">baby</option>\n' +
        '                <option value="2">preschool</option>\n' +
        '                <option value="3">junior-school</option>\n' +
        '                <option value="4">mid-school</option>\n' +
        '                <option value="5">adult</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select style="margin-bottom:15px;" class="form-control" id="search_language">\n' +
        '                <option value="0">Language</option>\n' +
        '                <option value="1">rus</option>\n' +
        '                <option value="2">ukr</option>\n' +
        '                <option value="3">eng</option>\n' +
        '                <option value="4">other</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_cover">\n' +
        '                <option value="0">Cover</option>\n' +
        '                <option value="1">hard</option>\n' +
        '                <option value="2">soft</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_illustrations">\n' +
        '                <option value="0">Illustrations</option>\n' +
        '                <option value="1">no</option>\n' +
        '                <option value="2">bw</option>\n' +
        '                <option value="3">color</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-3" id="year_from_group">\n' +
        '      <input type="text" class="form-control" id="search_year_from" placeholder="Year from">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-3" id="year_to_group">\n' +
        '      <input type="text" class="form-control" id="search_year_to" placeholder="Year to">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-offset-3 col-sm-3">\n' +
        '      <button type="submit" class="btn btn-default right" onclick="searchByCriteria(); return false">Search</button>\n' +
        '    </div>\n' +
        '  </div>\n';
    // +
    //     '</form>\n';
    setPageSubtitle(searchForm);
}

function displayFoundBooks(response) {
    let books = JSON.parse(response);
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
    return false;
}

function showOwnersBooks() {
    setPageTitle('My Books');
    setPageSubtitle('');

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                let subHeader =
                    '<br/><h4 class="panel-title">Today is a good day to start adding books </h4>\n' +
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
    xhr.open("GET", getOwnBooksUrl, true);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

// BOOK DETAILS
function showBookDetails(bookId, ownerId) {
    let collapsibleElement = document.getElementById("collapse" + bookId);
    if (collapsibleElement.classList.contains('in')) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    let html = '';

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let bookDetails = JSON.parse(this.responseText);
                console.log(bookDetails);

                let parsedOwnerName = notNull(bookDetails.ownerName);
                let parsedPublisher = notNull(bookDetails.publisher);
                let parsedLanguage = parseLanguage(bookDetails.language);
                let parsedYear = notNull(bookDetails.year);
                let parsedCover = parseCover(bookDetails.cover);
                let parsedIllustrations = parseIllustrations(bookDetails.illustrations);
                let parsedAgeGroup = parseAgeGroup(bookDetails.ageGroup);
                let parsedPages = notNull(bookDetails.pagesQuantity);
                let parsedDescription = notNull(bookDetails.description);

                if (bookDetails.active) {
                    html += '<div class="panel-body">\n';
                } else {
                    html += '<div class="panel-body inactive">\n' +
                        '<h5 class="text-muted strong">INACTIVE</h5>';
                }
                html +=
                    '<h5><span class="text-muted">Publisher: </span>' + parsedPublisher + '</h5>' +

                    '<h5><span class="text-muted">Language: </span>' + parsedLanguage + '</h5>' +
                    '<h5><span class="text-muted">Year: </span>' + parsedYear + '</h5>' +

                    '<h5><span class="text-muted">Cover: </span>' + parsedCover + '</h5>' +
                    '<h5><span class="text-muted">Illustrations: </span>' + parsedIllustrations + '</h5>' +

                    '<h5><span class="text-muted">Age group: </span>' + parsedAgeGroup + '</h5>' +
                    '<h5><span class="text-muted">Pages: </span>' + parsedPages + '</h5>' +

                    '<h5><span class="text-muted">Description: </span>' + parsedDescription + '</h5>' +
                    '<hr>';
                let bookDiv = "book-detail-thumbnails" + bookId;
                html +=
                    '<div id="' + bookDiv + '"></div>';

                if (bookDetails.ownerId != getCurrentUserId()) {
                    html +=
                        '<div class="content">\n owner: ' +
                        '<a class="underlined" id="book-details-owner" onclick="clickReader(' + ownerId + '); return false;">'
                        + parsedOwnerName + '</a></div>\n';
                } else {
                    html +=
                        '<div class="content">\n' +
                        '<button type="button" class="btn btn-default margin-left-5px" style="float: right" data-toggle="modal"' +
                        'onclick="openEditBookModal(' + bookId + ',\'' + bookDetails.title +
                        '\',\'' + bookDetails.authorName + '\',\'' + bookDetails.authorSurname +
                        '\',\'' + bookDetails.publisher + '\',\'' + bookDetails.language + '\',\'' + parsedYear +
                        '\',\'' + bookDetails.cover + '\',\'' + bookDetails.illustrations + '\',\'' + bookDetails.ageGroup +
                        '\',\'' + parsedPages + '\',\'' + parsedDescription + '\',\'' + bookDetails.active + '\'); ' +
                        'return false;">Edit</button>&nbsp;';
                    if (bookDetails.active) {
                        html +=
                            '<button type="button" class="btn btn-default margin-left-5px" style="float: right" ' +
                            'onclick="setInactive(' + bookId + ', \'' + bookDetails.title + '\'); return false; ">Set inactive</button>';
                    } else {
                        html +=
                            '<button type="button" class="btn btn-default margin-left-5px" style="float: right" ' +
                            'onclick="setActive(' + bookId + ', \'' + bookDetails.title + '\'); return false; ">Set active</button>';
                    }
                    html +=
                        '<button type="button" class="btn btn-default margin-left-5px" style="float: right" ' +
                        'onclick="openDeleteBookModal(' + bookId + ', \'' + bookDetails.title + '\'); return false;">Delete</button>' +
                        '</div>';

                }
            }
            let collapsed = document.getElementById("collapse" + bookId);
            collapsed.innerHTML = html;
            showBookImages(bookId);
        }
    }

    let requestUrl = HOME_PAGE + "/books/" + bookId;
    xhr.open("GET", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function parseAgeGroup(age_group) {
    switch (age_group) {
        case 1:
            return "baby";
        case 2:
            return "preschool";
        case 3:
            return "junior school";
        case 4:
            return "middle school";
        case 5:
            return "adult";
        default:
            return '';
    }
}

function parseIllustrations(illustrations) {
    switch (illustrations) {
        case 1:
            return "absent";
        case 2:
            return "black and white";
        case 3:
            return "color";
        default:
            return '';
    }
}

function parseCover(cover) {
    switch (cover) {
        case 1:
            return "hard";
        case 2:
            return "soft";
        default:
            return '';
    }
}

function parseLanguage(language) {
    switch (language) {
        case 1:
            return "russian";
        case 2:
            return "ukrainian";
        case 3:
            return "english";
        case 4:
            return "other";
        default:
            return '';
    }
}

function stringToBoolean(val) {
    if (val === 'true') {
        return true;
    } else if (val === 'false') {
        return false;
    } else {
        return '';
    }
}


function openDeleteBookModal(bookId, title) {
    $('#deleteBookModal').modal('show');
    document.getElementById("deleteBookModalTitle").innerHTML = ' <img class="img-responsive" style="margin:0 auto;" src="' +
        getRandomWarningImage() + '" alt="">\n';
    document.getElementById("deleteBookModalBody").innerHTML = 'If you do not want others to see this book, you can make it Inactive. <br><br>' +
        ' Do you still want to delete book \'' + title + '\'?';

    $('#deleteBookModal').modal('show');
    $('#delete-button').click(function () {
        deleteBook(bookId, title);
    });

}

function deleteBook(bookId, title) {
    $('#deleteBookModal').modal('hide');

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showWarningModal('Book \'' + title + '\' has been deleted');
            showOwnersBooks();
        }
    };

    let requestUrl = HOME_PAGE + "/books/" + bookId;
    xhr.open("DELETE", requestUrl);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function searchByCriteria() {
    let search_title = document.getElementById('search_title').value;
    let search_author_name = document.getElementById('search_author_name').value;
    let search_author_surname = document.getElementById('search_author_surname').value;
    let search_city = document.getElementById('search_city').value;
    let search_age_from = document.getElementById('search_age_from').value;
    let search_age_to = document.getElementById('search_age_to').value;
    let search_language = document.getElementById('search_language').value;
    let search_cover = document.getElementById('search_cover').value;
    let search_illustrations = document.getElementById('search_illustrations').value;
    let search_year_from = document.getElementById('search_year_from').value;
    let search_year_to = document.getElementById('search_year_to').value;

    if (!validateSearch(search_year_from, search_year_to)) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            // showSuccessModal('Search is done');
            let list = JSON.parse(this.response);
            let size = list.length;
            let result = '';
            for (let i = 0; i < size; i++) {
                result += list[i].title + ' ';
            }
            displayFoundBooks(this.responseText);
        }
    };

    const requestBody = {
        "title": search_title,
        "authorName": search_author_name,
        "authorSurname": search_author_surname,
        "city": search_city,
        "yearFrom": search_year_from,
        "yearTo": search_year_to,
        "language": search_language,
        "cover": search_cover,
        "illustrations": search_illustrations,
        "ageGroupFrom": search_age_from,
        "ageGroupTo": search_age_to
    };
    console.log(requestBody);
    let requestUrl = HOME_PAGE + "/books/search";
    xhr.open("POST", requestUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addAuthorization(xhr);
    xhr.send(JSON.stringify(requestBody));

    return false;
}

function validateSearch(search_year_from, search_year_to) {
    if (validateYear(search_year_from, 'year_from_group') &
        validateYear(search_year_to, 'year_to_group')) {
        return true;
    }
    return false;
}
