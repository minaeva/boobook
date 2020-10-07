function clickHome() {
    activateCabinet();
    selectMenu("menu_home");
    setPageTitle('My Books');
    setPageSubtitle('');
    clearContent();
    showOwnersBooks();
}

function clickAllBooks() {
    activateCabinet();
    selectMenu("menu_books");
    setPageTitle('Search');
    setPageSubtitle('');
    clearContent();

    showSearchBooksHeader();
}

function clickAllReaders() {
    activateCabinet();
    selectMenu("menu_readers");
    setPageTitle('Readers');
    setPageSubtitle('');
    clearContent();

    showSearchReadersHeader();
    // showAllReaders();
}

function showSearchReadersHeader() {
    let searchForm =
        '  <div class="row">' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_reader_name" placeholder="Name">\n' +
        '    </div>\n' +
        '    <div class="form-group col-md-6">\n' +
        '      <input type="text" class="form-control" id="search_reader_surname" placeholder="Surname">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_country" placeholder="Country">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_city" placeholder="City">\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-4">\n' +
        '      <input type="text" class="form-control" id="search_reader_district" placeholder="District">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="row">' +
        '    <div class="form-group col-sm-6">\n' +
        '        <div class="">\n' +
        '            <select class="form-control" id="search_reader_gender">\n' +
        '                <option value="0">Gender</option>\n' +
        '                <option value="1">female</option>\n' +
        '                <option value="2">male</option>\n' +
        '            </select>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="form-group col-sm-offset-3 col-sm-3">\n' +
        '      <button type="submit" class="btn btn-default right" onclick="searchReadersByCriteria(); return false">Search</button>\n' +
        '    </div>\n' +
        '  </div>\n';
    setPageSubtitle(searchForm);
}

function searchReadersByCriteria() {

}

function clickReader(readerId) {
    if (readerId != getCurrentUserId()) {
        selectMenu("menu_readers");
        setPageTitle('');
        setPageSubtitle('');
        showReaderDetails(readerId);
    } else {
        selectMenu("menu_home");
        setPageTitle('My Books');
        setPageSubtitle('');
    }
    clearContent();
    // document.getElementById("accordion").innerHTML = '';

    openReaderPage(readerId);
}

function clickFavoriteReaders() {
    activateCabinet();
    selectMenu('menu_favorite_readers');
    setPageTitle('My favorite readers');
    setPageSubtitle('');
    clearContent();

    showFavoriteReaders();
}

function clickProfile() {
    deselectActiveMenu();
    activateProfile();

    showProfile();
}

function activateCabinet() {
    addClassToElement("profile_body", "hidden");
    removeClassFromElement("books_readers_body", "hidden");
}

function activateProfile() {
    addClassToElement("books_readers_body", "hidden");
    removeClassFromElement("profile_body", "hidden");
}
