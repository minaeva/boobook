let auth2 = null;

function googleInit() {
    gapi.load('auth2', function () {
        if (auth2 == null) {
            initAuth2();
        }
    });
}

function initAuth2() {
    auth2 = gapi.auth2.init({
        clientId: "225049560926-gvnegbk3dnj6bgraot5h7d0gaoarge8b.apps.googleusercontent.com",
        scope: 'profile email'
    });
}

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let name = profile.getGivenName();
    let surname = profile.getFamilyName();
    let email = profile.getEmail();
    let idToken = googleUser.getAuthResponse().id_token;

    console.log('ID token: ' + idToken);
    console.log('Name: ' + name);
    console.log('Surname: ' + surname);
    console.log('Email: ' + email);

    registerGoogleReader(name, surname, email, idToken);
}

function googleSignOut() {
    if (auth2 != null) {
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
}



