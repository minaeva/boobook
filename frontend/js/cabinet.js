function setPageTitle(text) {
    var header = document.getElementById("accordion_header");
    header.innerHTML = text;
}

function setPageSubtitle(text) {
    var subHeader = document.getElementById("accordion_subheader");
    subHeader.innerHTML = text;
}

function clickHome() {
    selectMenu("menu_home", 'My Books');
    showOwnersBooks();
}

function clickBooks() {
    showAllBooks();
}

function clickReaders() {
    showAllReaders();
}

function clickFavoriteReaders() {
    selectMenu('menu_favorite_readers', 'My favorite readers');
    setPageSubtitle('');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {
            if (404 === this.status) {
                showWarningModal('Not any friend added yet. Click on <i class="fa fa-heart-o"></i> icon next to any reader')
            } else if (200 === this.status) {
                var readers = JSON.parse(this.responseText);
                var html = '';
                for (var i = 0; i < readers.length; i++) {
                    var reader = readers[i];
                    console.log(reader);
                    var heartId = 'heart' + reader.id;

                    html +=
                        '<div class="panel panel-default">\n' +
                        '    <div class="panel-heading" role="tab" id="heading' + reader.id + '">\n' +
                        '        <h4 class="panel-title">\n' +
                        '            <a data-toggle="collapse" onclick="openReaderPage(' + reader.id +
                        '); return false;" data-parent="#accordion" href="#collapse' + reader.id + '"\n' +
                        '               aria-expanded="true" aria-controls="collapse' + reader.id + '">\n';
                    var nameSurname = notNull(reader.name) + ' ' + notNull(reader.surname);
                    html += nameSurname +
                        ' <i class="fa fa-heart" id = \'' + heartId + '\' style="float: right"></i>' +
                        ' <h5><span class="text-muted"> City: </span> ' + notNull(reader.city) + '</h5>\n';

                    if (reader.fbPage != null) {
                        html +=
                            ' <h5><span class="text-muted"> Facebook page: </span> ' +
                            '     <a href=' + reader.fbPage + ' target="_blank" class="underline">view</a></h5>\n';
                    }
                    html +=
                        '               </a>\n' +
                        '        </h4>\n' +
                        '    </div>\n' +
                        '</div>\n';
                }
                document.getElementById("accordion").innerHTML = html;
            }
        }
    }

    var getFriendsUrl = HOME_PAGE + "/users/friends/" + getCurrentUserId();
    console.log(getFriendsUrl);
    xhttp.open("GET", getFriendsUrl, true);
    addAuthorization(xhttp);
    xhttp.send();

    return false;
}
