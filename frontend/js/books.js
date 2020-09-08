const validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
const PREVIEWS_QUANTITY = 5;
const NO_IMAGE = 'images/book-placeholder.png';
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

    let allFiles = retrieveImagesFromPreviews(IMAGE_TO_SAVE);
    if (!allFiles) {
        return false;
    }

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
                // console.log(allFiles);
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
                showSuccessModal("Book " + book_title + " was successfully edited");
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

function setInactive(bookId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set inactive');
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

function setActive(bookId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                showWarningModal('cannot find ' + bookId);
            } else if (this.status === 200) {
                showSuccessModal('Book has been set active');
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
    cleanPreviewsOnModalClose('target');
    return false;
}

function openEditModal(book_id, title, authorName, authorSurname, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description) {
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
    getEditBookImages(book_id);
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

function showAllBooks() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

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
    xhr.open("GET", getAllBooksUrl, true);
    addAuthorization(xhr);
    xhr.send();

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

                html += '<div id="book-detail-thumbnails">' +
                    '</div>';

                if (bookDetails.ownerId != getCurrentUserId()) {
                    html +=
                        '<div class="content">\n owner: ' +
                        '<a class="underlined" id="book-details-owner" onclick="clickReader(' + ownerId + '); return false;">'
                        + notNull(bookDetails.ownerName) + '</a></div>\n';
                } else {
                    html +=
                        // '<div class="btn-group edit-btn" style="float: right"> ' +
                        '<button type="button" class="btn btn-info margin-left-5px" style="float: right" data-toggle="modal"' +
                        'onclick="openEditModal(' + bookId + ',\'' + bookDetails.title + '\',\'' + bookDetails.authorName + '\',\'' + bookDetails.authorSurname +
                        '\',\'' + bookDetails.publisher + '\',\'' + bookDetails.language + '\',\'' + bookDetails.year +
                        '\',' + bookDetails.hardCover + ',' + bookDetails.illustrations + ',\'' + bookDetails.ageGroup +
                        '\',\'' + bookDetails.pagesQuantity + '\',\'' + bookDetails.description + '\'); ' +
                        'return false;">Edit</button>&nbsp;';
                    if (bookDetails.active) {
                        html +=
                            '<button type="button" class="btn btn-default margin-left-5px" style="float: right" onclick="setInactive(' + bookId + '); return false; ">Set inactive</button></div>';
                    } else {
                        html +=
                            '<button type="button" class="btn btn-default margin-left-5px" style="float: right" onclick="setActive(' + bookId + '); return false; ">Set active</button></div>';
                    }
                }
                // html += '  </div>\n';
            }
            let collapsed = document.getElementById("collapse" + bookId);
            collapsed.innerHTML = html;
            collapsed.focus();
            collapsed.scrollIntoView(true);
            getBookImages(bookId);
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

function isImage(input) {
    let source2parts = input.split(',');
    let mime = source2parts[0].match(/:(.*?);/)[1];
    if (!validImageTypes.includes(mime)) {
        return false;
    }
    return true;
}

function showMultiplePreviews(classNameBase, files) {
    let max = files.length < PREVIEWS_QUANTITY ? files.length : PREVIEWS_QUANTITY;

    for (let i = 0; i < max; i++) {
        let fr = new FileReader();
        fr.onload = function (e) {
            IMAGE_EDITED = true;
            if (isImage(this.result)) {
                target.src = this.result;
            }
        };
        fr.readAsDataURL(files[i]);
        let target = document.getElementById(classNameBase + i);
    }
}

function showOnePreview(src, target) {
    let fr = new FileReader();
    fr.onload = function (e) {
        if (isImage(this.result)) {
            IMAGE_EDITED = true;
            target.src = this.result;
        }
    };
    src.addEventListener("change", function () {
        fr.readAsDataURL(src.files[0]);
    });
}

function removePreview(className) {
    IMAGE_EDITED = true;
    document.getElementById(className).src = NO_IMAGE;
}

function retrieveImagesFromPreviews(elementIdBase) {
    let filesArray = [];
    for (let i = 0; i < PREVIEWS_QUANTITY; i++) {
        let file64 = document.getElementById(elementIdBase + i).src;
        if (!file64.includes(NO_IMAGE)) {
            if (!isImage(file64)) {
                continue;
            }

            let source2parts = file64.split(',');
            let base64data = atob(source2parts[1]);
            let base64dataLength = base64data.length;
            let int8array = new Uint8Array(base64dataLength);
            for (let c = 0; c < base64dataLength; c++) {
                int8array[c] = base64data.charCodeAt(c);
            }

            const name = `${Math.random().toString(36).slice(-5)}.jpg`;
            const file = new File([int8array], name, {type: "mime"});
            console.log('file', file);
            filesArray.push(file);
        }
    }
    return filesArray;
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

function getBookImages(bookId) {
    let xhr = new XMLHttpRequest();
    let byte64FilesArray = [];

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;

            let html = '';
            for (let i = 0; i < size; i++) {
                byte64FilesArray[i] = "data:image/png;base64," + list[i];
                html += '<img class="book-detail-thumbnail" src="' + byte64FilesArray[i] + '"/>';
            }

            document.getElementById('book-detail-thumbnails').innerHTML = html;
            return false;
        } else if (this.readyState == 4 && this.status == 404) {
            console.log('not any image connected to book with id ' + bookId);
            return false;
        }
    }
    let url = HOME_PAGE + "/images/" + bookId;
    xhr.open('GET', url);
    addAuthorization(xhr);
    xhr.send();
}

function getEditBookImages(bookId) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;
            let max = size < PREVIEWS_QUANTITY ? size : PREVIEWS_QUANTITY;

            for (let i = 0; i < max; i++) {
                document.getElementById("edit_target" + i).src =
                    "data:image/png;base64," + list[i];
            }
            return false;
        } else if (this.readyState == 4 && this.status == 404) {
            console.log('not any image connected to book with id ' + bookId);
            return false;
        }
    }
    let url = HOME_PAGE + "/images/" + bookId;
    xhr.open('GET', url);
    addAuthorization(xhr);
    xhr.send();
}

function updateImages(filesToUpload, bookId) {
    alert('UPDATE IS NEEDED');
    let formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
        formData.append('files', filesToUpload[i]);
    }
    formData.append('bookId', bookId);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 500) {
                showWarningModal("When updating the images, there was a server error");
                return false;
            } else if (this.status == 403) {
                showWarningModal("When updating the images, there was a problem with authentication");
                return false;
            } else if (this.status == 200) {
                console.log("Images updated");
            }
        }
    };

    let requestUrl = HOME_PAGE + "/images/" + bookId;
    console.log(requestUrl);

    xhr.open("PUT", requestUrl);
    addAuthorization(xhr);
    xhr.send(formData);
}