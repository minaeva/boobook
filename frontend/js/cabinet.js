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

    showAllReaders();
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
    addClassToElement("page-inner-profile", "hidden");
    removeClassFromElement("page-inner-cabinet", "hidden");
}

function activateProfile() {
    addClassToElement("page-inner-cabinet", "hidden");
    removeClassFromElement("page-inner-profile", "hidden");
}
