function clickHome() {
    activateCabinet();
    selectMenu("menu_home");
    setPageTitle(application_language.menu_my_books_title);
    setPageSubtitle('');
    clearContent();
    showOwnersBooks();
}

function clickAllBooks() {
    activateCabinet();
    selectMenu("menu_books");
    setPageTitle(application_language.menu_books_title);
    setPageSubtitle('');
    clearContent();

    showSearchBooksHeader();
}

function clickAllReaders() {
    activateCabinet();
    selectMenu("menu_readers");
    setPageTitle(application_language.menu_readers_title);
    setPageSubtitle('');
    clearContent();

    showSearchReadersHeader();
    // showAllReaders();
}

function clickReader(readerId) {
    if (readerId != getCurrentUserId()) {
        selectMenu("menu_readers");
        setPageTitle('');
        setPageSubtitle('');
        showReaderDetails(readerId);
    } else {
        selectMenu("menu_home");
        setPageTitle(application_language.menu_my_books_title);
        setPageSubtitle('');
    }
    clearContent();
    // document.getElementById("accordion").innerHTML = '';

    openReaderPage(readerId);
}

function clickFavoriteReaders() {
    activateCabinet();
    selectMenu('menu_favorite_readers');
    setPageTitle(application_language.favorite_readers_title);
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

function openCabinet() {
    resetLanguageOnCabinet();
    showOwnersBooks();
    resetLanguage();

}
