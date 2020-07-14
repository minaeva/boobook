function setPageTitle(text) {
    document.getElementById("accordion_header").innerHTML = text;
}

function setPageSubtitle(text) {
    var subHeader = document.getElementById("accordion_subheader");
    subHeader.innerHTML = text;
}

function clickHome() {
    activateCabinet();
    selectMenu("menu_home");
    setPageTitle('My Books');

    showOwnersBooks();
}

function clickAllBooks() {
    activateCabinet();
    selectMenu("menu_books");
    setPageTitle('Books');

    showAllBooks();
}

function clickAllReaders() {
    activateCabinet();
    selectMenu("menu_readers");
    setPageTitle('Readers');

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
    }
    document.getElementById("accordion").innerHTML = '';

    openReaderPage(readerId);
}

function clickFavoriteReaders() {
    activateCabinet();
    selectMenu('menu_favorite_readers');
    setPageTitle('My favorite readers');
    setPageSubtitle('');

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
