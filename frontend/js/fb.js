function handle_fb_data(response) {
    FB.api('/me', {fields: 'name, email'}, function (response) {
        registerAFbReader(response.name, response.email, response.id);

        $.ajax({
            type: 'post',
            url: '/do/reg/fb',
            data: response,
            success: function (msg) {
                console.log(msg);
                if ((msg == 'зарегались') || (msg == 'залогинились')) {
                    window.location.reload();
                }
            },
            error: function () {
            }
        })
    });
}

function fb_login() {
    FB.getLoginStatus(function (response) {
        if (response.authResponse) {
            handle_fb_data(response);
        } else {
            FB.login(function (response) {
                if (response.authResponse) {
                    handle_fb_data(response);
                } else {
                }
            });
        }
    }, {
        scope: 'email,id'
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '249883846119295',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
};
(function (d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
