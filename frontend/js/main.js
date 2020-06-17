const HOME_PAGE = "http://localhost:8008";

function getCurrentUserId() {
    var tokenData = localStorage.getItem('tokenData');
    var jsonInside = JSON.parse(tokenData);
    return jsonInside.id;
}

