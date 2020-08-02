let stompClient;

function connectToChat() {
    let userId = getCurrentUserId();
    console.log("connecting to chat");
    let url = MESSAGE_SERVICE_HOME + "/chat";
    let socket = new SockJS(url);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to: " + frame);
        stompClient.subscribe('/topic/messages/' + userId, function (response) {
            let data = JSON.parse(response.body);
            console.log('Topic/messages subscribe response: ' + data);
        })
    });
}

function sendMessage(from, to) {
    let text = document.getElementById('chat-new-text').value;

    let token = getTokenFromLocalStorage();
    stompClient.send("/app/chat/" + to, {},
        JSON.stringify({
            from: from,
            message: text,
            authToken: token
        }))
    appendNewMessage(getCurrentTime(), text, to);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
}

function getUserConversationalists() {
    // connectToChat(getCurrentUserId());

    let token = getTokenFromLocalStorage();
    $.ajaxSetup({
        headers: {
            AUTHORIZATION: BEARER + token
        }
    });

    $.get(MESSAGE_CONTROLLER + "/conversationalists", function (response) {
        let users = response;
        let userDataHtml = '';
        for (let i = 0; i < users.length; i++) {
            let userNameSurname = users[i].name + ' ' + users[i].surname;
            userDataHtml +=
                '        <a href="#" onclick="openConversation(' + users[i].id + ', \'' + userNameSurname + '\')"' +
                ' class="right-sidebar-toggle chat-item unread" data-sidebar-id="chat-right-sidebar">\n' +
                '            <div class="user-avatar">\n' +
                '                <img src="images/reader-girl.png" alt="">\n' +
                '            </div>\n' +
                '            <div class="chat-info">\n' +
                '               <span class="chat-author">' + userNameSurname + '</span>' +
                '            </div>\n' +
                '      </a>\n';
        }
        let allUsersHtml =
            '    <div class="chat-list">\n' +
            '       <span class="chat-title">Recent</span>\n' + userDataHtml +
            '    </div>\n';
        $('#chat').html(allUsersHtml);
    });
}

function openChatWindow() {
    $('#chat-right-sidebar').addClass('visible');
}

function closeChatWindow() {
    $('#chat-right-sidebar').removeClass('visible');
    getUserConversationalists();
}

function openConversation(userId, userNameSurname) {
    console.log("open chat for user " + userId + ' ' + userNameSurname);
    openChatWindow();

    let token = getTokenFromLocalStorage();
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    $.get(MESSAGE_CONTROLLER + "/withUser/" + userId, function (response) {
        let messages = response;
        let messageDataHtml = '';
        for (let i = 0; i < messages.length; i++) {
            console.log(messages[i]);
            let chatBubbleOwner;
            if (messages[i].from === userId) {
                chatBubbleOwner =
                    '    <div class="chat-bubble them">\n' +
                    '        <div class="chat-bubble-img-container">\n' +
                    '            <img src="images/reader-girl.png" alt="">\n' +
                    '        </div>\n';
            } else {
                chatBubbleOwner =
                    '    <div class="chat-bubble me">\n';
            }
            messageDataHtml +=
                '   <div class="chat-start-date">' + messages[i].dateTimeString + '</div>\n' +
                chatBubbleOwner +
                '       <div class="chat-bubble-text-container">\n' +
                '           <span class="chat-bubble-text">' + messages[i].message + '</span>\n' +
                '       </div>' +
                '   </div>\n';
        }
        let wholeChatHtml =
            '<div class="page-right-sidebar-inner">\n' +
            '    <div class="right-sidebar-top">\n' +
            '       <div class="chat-top-info">\n' +
            '           <span class="chat-name">' + userNameSurname + '</span>' +
            '       </div>' +
            '       <a href="#" onclick="closeChatWindow();" class="right-sidebar-toggle chat-sidebar-close pull-right"\n' +
            'data-sidebar-id="chat-right-sidebar"><i class="icon-keyboard_arrow_right"></i></a>' +
            '   </div>' +

            '   <div class="right-sidebar-content">\n' +
            '       <div class="right-sidebar-chat slimscroll" id="to-be-scrolled">\n' +
            '           <div class="chat-bubbles">' +
            messageDataHtml +
            '           </div>' +

            '          <div class="chat-write">\n' +
            '               <form class="form-horizontal" action="#" onsubmit="sendMessage(' +
            getCurrentUserId() +
            ', ' + userId + '); return false;">\n' +
            '                   <input type="text" id="chat-new-text" class="form-control" autocomplete="off" placeholder="Say something">\n' +
            '               </form>\n' +
            '           </div>' +
            '       </div>' + //right-sidebar-chat slimscroll

            '   </div>\n' + //right-sidebar-content
            '</div>'; //page-right-sidebar-inner
        $('#chat-right-sidebar').html(wholeChatHtml);
        $('#chat-new-text').focus();
    });

}

function appendNewMessage(dateTime, text, to) {
    $('.chat-write').remove();
    let newMessage =
        '   <div class="chat-start-date">' + dateTime +
        '   </div>\n' +
        '   <div class="chat-bubble me">\n' +
        '       <div class="chat-bubble-text-container">\n' +
        '           <span class="chat-bubble-text">' + text + '</span>\n' +
        '       </div>' +
        '   </div>\n' +
        '   <div class="chat-write">\n' +
        '       <form class="form-horizontal" action="#" onsubmit="sendMessage(' +
        getCurrentUserId() + ', ' + to + '); return false;">' +
        '           <input type="text" id="chat-new-text" class="form-control" autocomplete="off" placeholder="Say something">\n' +
        '       </form>\n' +
        '   </div>';

    $('#to-be-scrolled').append(newMessage);
    $('#to-be-scrolled').scrollTop($('#to-be-scrolled')[0].scrollHeight);
    $('#chat-new-text').focus();
}
