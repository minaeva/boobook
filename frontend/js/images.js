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

function removeReaderPreview(className) {
    IMAGE_EDITED = true;
    document.getElementById(className).src = NO_READER_IMAGE;
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

function retrieveProfileImage() {
    let file64 = document.getElementById('edit_reader_target').src;
    if (!file64.includes(NO_READER_IMAGE)) {
        if (!isImage(file64)) {
            return null;
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
        console.log('profile image: ', file);
        return file;
    }
}

function showBookImages(bookId) {
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
            document.getElementById('book-detail-thumbnails' + bookId).innerHTML = html;
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

function getBookImageSources(bookId) {
    let xhr = new XMLHttpRequest();
    let imageSources = [];

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(this.response);
            let size = list.length;

            for (let i = 0; i < size; i++) {
                imageSources[i] = "data:image/png;base64," + list[i];
            }
            return imageSources;
        } else if (this.readyState == 4 && this.status == 404) {
            console.log('not any image connected to book with id ' + bookId);
            return null;
        }
    }
    let url = HOME_PAGE + "/images/" + bookId;
    xhr.open('GET', url);
    addAuthorization(xhr);
    xhr.send();
}

function showEditBookImages(bookId) {
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
            for (let i = 0; i < 5; i++) {
                document.getElementById("edit_target" + i).src = NO_IMAGE;
            }
            return false;
        }
    }
    let url = HOME_PAGE + "/images/" + bookId;
    xhr.open('GET', url);
    addAuthorization(xhr);
    xhr.send();
}

function saveImages(filesToUpload, bookId) {
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
                console.log("Images added!");
            }
        }
    };

    let requestUrl = HOME_PAGE + "/images";
    xhr.open("POST", requestUrl);
    addAuthorization(xhr);
    xhr.send(formData);
}

function updateImages(filesToUpload, bookId) {
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

    let requestUrl = HOME_PAGE + "/images";
    xhr.open("PUT", requestUrl);
    addAuthorization(xhr);
    xhr.send(formData);
}
