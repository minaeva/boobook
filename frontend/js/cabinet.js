function hideLeftMenu() {
    $('#sidebar-toggle-button-close').click();
    return false;
}

function clickHome() {
    hideLeftMenu();
    activateMyBooksMenu();
}

function clickHomeForTheFirstTime() {
    activateMyBooksMenu();
}

function activateMyBooksMenu() {
    activateCabinet();
    selectMenu("menu_home");
    setPageTitle(application_language.menu_my_books_title);
    setPageSubtitle('');
    clearContent();
    showOwnersBooks();
}

function clickAllBooks() {
    hideLeftMenu();
    activateCabinet();
    selectMenu("menu_books");
    setPageTitle(application_language.menu_books_title);
    setPageSubtitle('');
    clearContent();

    showSearchBooksHeader();
}

function clickAllReaders() {
    hideLeftMenu();
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
        hideLeftMenu();
        clickHome();
    }
    clearContent();

    openReaderPage(readerId);
}

function clickFavoriteReaders() {
    hideLeftMenu();
    activateCabinet();
    selectMenu('menu_favorite_readers');
    setPageTitle(application_language.favorite_readers_title);
    setPageSubtitle('');
    clearContent();

    showFavoriteReaders();
}

function clickProfile() {
    hideLeftMenu();
    deselectActiveMenu();
    selectMenu('menu_profile');
    activateProfile();

    showProfile();
}

function clickAbout() {
    hideLeftMenu();
    selectMenu('profile_about_title');
    activateAbout();

    setPageTitle(application_language.profile_about_title);
    setPageSubtitle('');
    clearContent();

}

function activateCabinet() {
    addClassToElement("profile_body", "hidden");
    addClassToElement("about_body", "hidden");
    removeClassFromElement("books_readers_body", "hidden");
}

function activateProfile() {
    addClassToElement("books_readers_body", "hidden");
    addClassToElement("about_body", "hidden");
    removeClassFromElement("profile_body", "hidden");
}

function activateAbout() {
    addClassToElement("books_readers_body", "hidden");
    addClassToElement("profile_body", "hidden");
    removeClassFromElement("about_body", "hidden");
}

function openCabinet() {
    resetLanguageOnCabinet();
    showOwnersBooks();
    resetLanguage();

}
