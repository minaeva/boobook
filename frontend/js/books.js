const validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
const PREVIEWS_QUANTITY = 5;
const NO_IMAGE = 'images/book-placeholder.png';
const NO_READER_IMAGE = 'images/reader.png';
let IMAGE_EDITED;
const IMAGE_TO_SAVE = 'target';
const IMAGE_TO_EDIT = 'edit_target';
let ADD_BOOK_MODAL_LISTENER_ADDED = false;
let EDIT_BOOK_MODAL_LISTENER_ADDED = false;

function saveBook() {

    let book_title = document.getElementById("book_title").value.trim();
    let author_name = document.getElementById("author_name").value.trim();
    let author_surname = document.getElementById("author_surname").value.trim();
    let publisher = document.getElementById("publisher").value.trim();
    let cover = document.getElementById("cover").value;
    let illustrations = document.getElementById("illustrations").value;
    let age_group = document.getElementById("age_group").value;
    let year = document.getElementById("year").value;
    let language = document.getElementById("language").value;
    let pages_quantity = document.getElementById("pages_quantity").value;
    let description = document.getElementById("description").value.trim();

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
                showWarningModal(application_language.book_title + '\'' + book_title + '\'' + application_language.cannotBeAdded_title);
                return false;
            } else if (this.status === 200) {
                let response = JSON.parse(this.responseText);
                let bookId = response.id;
                showSuccessModal(application_language.book_title + '\'' + book_title + '\'' + application_language.hasBeenAdded_title);
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
    let book_title = document.getElementById("edit_book_title").value.trim();
    let author_name = document.getElementById("edit_author_name").value.trim();
    let author_surname = document.getElementById("edit_author_surname").value.trim();
    let publisher = document.getElementById("edit_publisher").value.trim();
    let cover = document.getElementById("edit_cover").value.trim();
    let illustrations = document.getElementById("edit_illustrations").value.trim();
    let age_group = document.getElementById("edit_age_group").value;
    let year = notNull(document.getElementById("edit_year").value);
    let language = document.getElementById("edit_language").value;
    let pages_quantity = document.getElementById("edit_pages_quantity").value;
    let description = document.getElementById("edit_description").value.trim();
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
                showWarningModal(application_language.book_title + '\'' + book_title + '\'' + application_language.cannotBeEdited_title);
                return false;
            } else if (this.status === 200) {
                if (IMAGE_EDITED) {
                    updateImages(allFiles, book_id);
                }
                showSuccessModal(application_language.book_title + '\'' + book_title + '\'' + application_language.hasBeenEdited_title);
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
                showSuccessModal(application_language.book_title + '\'' + title + '\'' + application_language.hasBeenSetInactive_title);
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
                showSuccessModal(application_language.book_title + '\'' + title + '\'' + application_language.hasBeenSetActive_title);
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

    clearAddBookModalFields();

    initYearPicker();
    $('#year').val('');

    IMAGE_EDITED = false;

    let fileButton = document.getElementById("fileButton"),
        fileInput = document.getElementById("fileInput");

    if (ADD_BOOK_MODAL_LISTENER_ADDED == false) {
        fileButton.addEventListener("click", function (e) {
            if (fileInput) {
                fileInput.click();
            }
            e.preventDefault();
        }, false);
        ADD_BOOK_MODAL_LISTENER_ADDED = true;
    }
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

function clearAddBookModalFields() {
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
}

function closeAddBookModal() {
    $('#addBookModal').modal('hide');
    if ($('#book_title_group').hasClass('has-error')) {
        $('#book_title_group').removeClass('has-error');
    }
    if ($('#author_name_group').hasClass('has-error')) {
        $('#author_name_group').removeClass('has-error');
    }
    if ($('#author_surname_group').hasClass('has-error')) {
        $('#author_surname_group').removeClass('has-error');
    }
    return false;
}

function openImageModal(iString, size) {
    let i = Number.parseInt(iString, 10);
    $('#imageModal').modal('show');

    let src = "data:image/png;base64," + imagesToShow[i];
    $('#imagepreview').attr("src", src);

    let previous = (i > 0) ? i - 1 : size - 1;
    let next = (i == size - 1) ? 0 : i + 1;

    $("#left_arrow").attr("onclick", "openImageModal('" + previous + "', '" + size + "')");
    $("#right_arrow").attr("onclick", "openImageModal('" + next + "', '" + size + "')");


    $('#imageModal').off();

    $('#imageModal').on('keydown', e => {
        switch (e.which) {
            case 37: // left
                openImageModal(previous, size);
                break;
            case 39: // right
                openImageModal(next, size);
                break;
            case 27:
                $('#imageModal').modal('hide');
                break;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $(document).click(function (e) {
        if ($(e.target).is('#imageModal')) {
            $('#imageModal').modal('hide');
        }

    });
}

function closeImageModal() {
    $('#imageModal').modal('hide');
}

function openEditBookModal(book_id, title, authorName, authorSurname, publisher, language, year, cover, illustrations, ageGroup, pagesQuantity, description, active) {
    $('#editBookModal').modal('show');
    $('#editBookModal').on('shown.bs.modal', function () {
        $('#edit_book_title').focus();
    })
    IMAGE_EDITED = false;

    initYearPicker();

    let fileButton = document.getElementById("edit_fileButton"),
        fileInput = document.getElementById("edit_fileInput");

    if (EDIT_BOOK_MODAL_LISTENER_ADDED == false) {

        fileButton.addEventListener("click", function (e) {
            if (fileInput) {
                fileInput.click();
                IMAGE_EDITED = true;
            }
            e.preventDefault();
        }, false);
        EDIT_BOOK_MODAL_LISTENER_ADDED = true;
    }

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
    if ($('#edit_book_title_group').hasClass('has-error')) {
        $('#edit_book_title_group').removeClass('has-error');
    }
    if ($('#edit_author_name_group').hasClass('has-error')) {
        $('#edit_author_name_group').removeClass('has-error');
    }
    if ($('#edit_author_surname_group').hasClass('has-error')) {
        $('#edit_author_surname_group').removeClass('has-error');
    }
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

    let searchForm =
        '  <div class="row">' +
        '    <div class="form-group col-md-12">\n' +
        '      <input type="text" class="form-control" id="search_title" placeholder="' +
        application_language.search_book_title_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_author_name" placeholder="' +
        application_language.search_book_author_name_title + '">\n' +
        '    </div>\n' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_author_surname" placeholder="' +
        application_language.search_book_author_surname_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-12">\n' +
        '      <input type="text" class="form-control" id="search_city" placeholder="' +
        application_language.search_book_city_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_age_from">\n' +
        '                <option value="0">' + application_language.search_book_age_from_title + '</option>\n' +
        '                <option value="1">' + application_language.select_age_baby_title + '</option>\n' +
        '                <option value="2">' + application_language.select_age_preschool_title + '</option>\n' +
        '                <option value="3">' + application_language.select_age_junior_title + '</option>\n' +
        '                <option value="4">' + application_language.select_age_midschool_title + '</option>\n' +
        '                <option value="5">' + application_language.select_age_adult_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_age_to">\n' +
        '                <option value="0">' + application_language.search_book_age_to_title + '</option>\n' +
        '                <option value="1">' + application_language.select_age_baby_title + '</option>\n' +
        '                <option value="2">' + application_language.select_age_preschool_title + '</option>\n' +
        '                <option value="3">' + application_language.select_age_junior_title + '</option>\n' +
        '                <option value="4">' + application_language.select_age_midschool_title + '</option>\n' +
        '                <option value="5">' + application_language.select_age_adult_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-offset-2 col-sm-4" id="year_from_group">\n' +
        '      <input type="text" class="form-control yearpicker" autocomplete="off" id="search_year_from" placeholder="' +
        application_language.search_book_year_from_title + '">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4" id="year_to_group">\n' +
        '      <input type="text" class="form-control yearpicker" autocomplete="off" id="search_year_to" placeholder="' +
        application_language.search_book_year_to_title + '">\n' +
        '    </div>\n' +
        '  </div>\n' +

        '  <div class="row">' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select style="margin-bottom:15px;" class="form-control" id="search_language">\n' +
        '                <option value="0">' + application_language.language_title + '</option>\n' +
        '                <option value="1">' + application_language.language_rus_title + '</option>\n' +
        '                <option value="2">' + application_language.language_ukr_title + '</option>\n' +
        '                <option value="3">' + application_language.language_eng_title + '</option>\n' +
        '                <option value="4">' + application_language.language_oth_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_cover">\n' +
        '                <option value="0">' + application_language.cover_title + '</option>\n' +
        '                <option value="1">' + application_language.select_hard_title + '</option>\n' +
        '                <option value="2">' + application_language.select_soft_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_illustrations">\n' +
        '                <option value="0">' + application_language.illustrations_title + '</option>\n' +
        '                <option value="1">' + application_language.select_illustrations_no_title + '</option>\n' +
        '                <option value="2">' + application_language.select_illustrations_bw_title + '</option>\n' +
        '                <option value="3">' + application_language.select_illustrations_color_title + '</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-offset-9 col-sm-3">\n' +
        '      <button type="submit" class="btn btn-default right" onclick="searchBooksByCriteria(); return false">' +
        application_language.search_button_title + '</button>\n' +
        '    </div>\n' +
        '  </div>\n';
    // +
    //     '</form>\n';


    setPageSubtitle(searchForm);

    initYearPicker();
    $('#search_year_from').val('');
    $('#search_year_to').val('');
}

function showFoundBooks(response) {
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
            '            <h5 class="text-muted">' + book.authorName + ' ' + book.authorSurname + '</h5>\n' +
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
    if (getCurrentUserId() == null) {
        logout();
    }
    setPageTitle(application_language.menu_my_books_title);

    let addBookButton =
        '<div class="row"><div class="col-sm-12"> <button class="btn btn-default right" onclick="openAddBookModal(); return false" data-toggle="modal">' +
        // '<i class="menu-icon icon-books"></i>' +
        '<i class="menu-icon fa fa-book"></i>&nbsp;&nbsp;' +
        '<span id="menu_add_book_title">' + application_language.menu_add_book_title + '</span>' +
        '</button></div> </div>';

    setPageSubtitle(addBookButton);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (this.status === 404) {
                let subHeader =
                    '<br/><h4 class="panel-title">' + application_language.goodDayToStartAddingBooks_title + '</h4>\n' +
                    '     <button type="button" class="btn btn-info" data-toggle="modal" data-target="#addBookModal">' +
                    application_language.add_book_title + '</button>\n';
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
                        '            <h5 class="text-muted">' + notNull(book.authorName) + ' ' + notNull(book.authorSurname) + '</h5>\n' +
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
                        '<h5 class="text-muted strong">' + application_language.details_inactive_title + '</h5>';
                }
                if (!isEmpty(parsedPublisher)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_publisher_title + '</span>' + parsedPublisher + '</h5>';
                }
                if (!isEmpty(parsedLanguage)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_language_title + '</span>' + parsedLanguage + '</h5>';
                }
                if (!isEmpty(parsedYear)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_year_title + '</span>' + parsedYear + '</h5>';
                }
                if (!isEmpty(parsedCover)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_cover_title + '</span>' + parsedCover + '</h5>';
                }
                if (!isEmpty(parsedIllustrations)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_illustrations_title + '</span>' + parsedIllustrations + '</h5>';
                }
                if (!isEmpty(parsedAgeGroup)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_ageGroup_title + '</span>' + parsedAgeGroup + '</h5>';
                }
                if (!isEmpty(parsedPages)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_pages_title + '</span>' + parsedPages + '</h5>';
                }
                if (!isEmpty(parsedDescription)) {
                    html +=
                        '<h5><span class="text-muted">' + application_language.details_description_title + '</span>' + parsedDescription + '</h5>';
                }
                let bookDiv = "book-detail-thumbnails" + bookId;
                html +=
                    '<hr><div id="' + bookDiv + '"></div>';

                if (bookDetails.ownerId != getCurrentUserId()) {
                    html +=
                        '<div class="content">\n ' + application_language.details_owner_title +
                        '<a class="underlined" id="book-details-owner" onclick="clickReader(' + ownerId + '); return false;">'
                        + parsedOwnerName + '</a></div>\n';
                } else {
                    html +=
                        '<div class="content">\n' +
                        '<button type="button" class="btn btn-default margin-3px" style="float: right" data-toggle="modal"' +
                        'onclick="openEditBookModal(' + bookId + ',\'' + bookDetails.title +
                        '\',\'' + bookDetails.authorName + '\',\'' + bookDetails.authorSurname +
                        '\',\'' + bookDetails.publisher + '\',\'' + bookDetails.language + '\',\'' + parsedYear +
                        '\',\'' + bookDetails.cover + '\',\'' + bookDetails.illustrations + '\',\'' + bookDetails.ageGroup +
                        '\',\'' + parsedPages + '\',\'' + parsedDescription + '\',\'' + bookDetails.active + '\'); ' +
                        'return false;">' + application_language.details_edit_book_button_title + '</button>&nbsp;';
                    if (bookDetails.active) {
                        html +=
                            '<button type="button" class="btn btn-default margin-3px" style="float: right" ' +
                            'onclick="setInactive(' + bookId + ', \'' + bookDetails.title + '\'); return false; ">' +
                            application_language.details_set_inactive_button_title + '</button>';
                    } else {
                        html +=
                            '<button type="button" class="btn btn-default margin-3px" style="float: right" ' +
                            'onclick="setActive(' + bookId + ', \'' + bookDetails.title + '\'); return false; ">' +
                            application_language.details_set_active_button_title + '</button>';
                    }
                    html +=
                        '<button type="button" class="btn btn-default margin-3px" style="float: right" ' +
                        'onclick="openDeleteBookModal(' + bookId + ', \'' + bookDetails.title + '\'); return false;">' +
                        application_language.details_delete_button_title + '</button>' +
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
            return application_language.select_age_baby_title;
        case 2:
            return application_language.select_age_preschool_title;
        case 3:
            return application_language.select_age_junior_title;
        case 4:
            return application_language.select_age_midschool_title;
        case 5:
            return application_language.select_age_adult_title;
        default:
            return '';
    }
}

function parseIllustrations(illustrations) {
    switch (illustrations) {
        case 1:
            return application_language.select_illustrations_no_title;
        case 2:
            return application_language.select_illustrations_bw_title;
        case 3:
            return application_language.select_illustrations_color_title;
        default:
            return '';
    }
}

function parseCover(cover) {
    switch (cover) {
        case 1:
            return application_language.select_hard_title;
        case 2:
            return application_language.select_soft_title;
        default:
            return '';
    }
}

function parseLanguage(language) {
    switch (language) {
        case 1:
            return application_language.language_rus_title;
        case 2:
            return application_language.language_ukr_title;
        case 3:
            return application_language.language_eng_title;
        case 4:
            return application_language.language_oth_title;
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
    document.getElementById("delete_book_modal_title_title").innerHTML = ' <img class="img-responsive" style="margin:0 auto;" src="' +
        getRandomWarningImage() + '" alt="">\n';
    document.getElementById("delete_book_modal_body_title").innerHTML = application_language.doNotDelete_warning_title + '<br><br>' +
        application_language.doYouStillWantToDelete_title + ' \'' + title + '\'?';

    $('#deleteBookModal').modal('show');
    $('#delete_book_delete_title').click(function () {
        deleteBook(bookId, title);
    });

}

function deleteBook(bookId, title) {
    $('#deleteBookModal').modal('hide');

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showWarningModal(application_language.book_title + '\'' + title + '\'' + application_language.hasBeenDeleted_title);
            showOwnersBooks();
        }
    };

    let requestUrl = HOME_PAGE + "/books/" + bookId;
    xhr.open("DELETE", requestUrl);
    addAuthorization(xhr);
    xhr.send();

    return false;
}

function searchBooksByCriteria() {
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

    if (!validateBookSearch(search_year_from, search_year_to)) {
        return false;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;
            if (size == 0) {
                showWarningModal(application_language.noBookWasFound_title);
            }
            showFoundBooks(this.responseText);
        }
        if (this.readyState === 4 && this.status == 404) {
            showWarningModal(application_language.noBookWasFound_title);
        }
    }
    ;

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


