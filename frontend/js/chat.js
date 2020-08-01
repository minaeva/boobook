const url = 'http://localhost:8010/messages';
let stompClient;
let selectedUser;

function connectToChat(userName) {
    console.log("connecting to chat");
    let socket = new SockJs(url + "/chat");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to: " + frame);
        stompClient.subscribe('/topic/messages/' + userName, function (response) {
            let data = JSON.parse(response.body);
            console.log(data);
        })
    });
}

function sendMessage(from, text, to) {
    stompClient.send("/app/chat" + selectedUser, {}, JSON.stringify({
        from: from,
        message: text,
        to: to
    }))
}

function getUserConversationalists() {
    let token = getTokenFromLocalStorage();
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    $.get(url + "/conversationalists", function (response) {
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

    $.get(url + "/withUser/" + userId, function (response) {
        let messages = response;
        let messageDataHtml = '';
        for (let i = 0; i < messages.length; i++) {
            console.log(messages[i]);
            let chatBubbleOwner;
            if (messages[i].from === userId) {
                chatBubbleOwner = '    <div class="chat-bubble them">\n' +
                    '        <div class="chat-bubble-img-container">\n' +
                    '            <img src="images/reader-girl.png" alt="">\n' +
                    '        </div>\n';
            } else {
                chatBubbleOwner = '    <div class="chat-bubble me">\n';
            }
            messageDataHtml +=
                '    <div class="chat-start-date">' + messages[i].dateTimeString + '</div>\n' +
                chatBubbleOwner +
                '        <div class="chat-bubble-text-container">\n' +
                '            <span class="chat-bubble-text">' + messages[i].message + '</span>\n' +
                '        </div>\n' +
                '    </div>\n';
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
            '       <div class="right-sidebar-chat slimscroll">\n' +
            '           <div class="chat-bubbles">' +
            messageDataHtml +
            '           </div>' +
            '       </div>' +
            '       <div class="chat-write">\n' +
            '           <form class="form-horizontal" action="javascript:void(0);">\n' +
            '               <input type="text" class="form-control" placeholder="Say something">\n' +
            '           </form>\n' +
            '       </div>' +
            '   </div>\n' +
            '</div>';
        $('#chat-right-sidebar').html(wholeChatHtml);
    });

}



