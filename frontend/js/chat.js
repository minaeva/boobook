let stompClient;
let insideTheList = false;
let newMessagesFrom = [];

function connectToChat() {
    let userId = getCurrentUserId();
    console.log("connecting to chat with user: " + userId);
    let chatUrl = MESSAGE_SERVICE_HOME + '/chat';
    let subscribeUrl = '/topic/messages/' + userId;
    console.log("chatUrl: " + chatUrl + ', subscribeUrl: ' + subscribeUrl);
    let socket = new SockJS(chatUrl);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to frame: " + frame);
        stompClient.subscribe(subscribeUrl, function (response) {
            console.log('on message happened');
            receiveMessage(response);
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
    let newMessage = {
        from: from,
        message: text,
        to: to,
        dateTimeString: formatDate()
    };
    appendNewMessage(newMessage, to);
}

function formatDate() {
    //todo
    let mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let d = new Date(),
        month = '' + mlist[d.getMonth()],
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (day.length < 2) day = '0' + day;
    let time = d.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

    return day + ' ' + month + ' ' + year + ', ' + time;
}

function getUserConversationalists() {

    insideTheList = true;

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
            '       <span class="chat-title" id="recent_title"></span>\n' + userDataHtml +
            '    </div>\n';
        $('#chat').html(allUsersHtml);
        $('#recent_title').text(application_language.recent_title);
    });
}

function openChatWindow() {
    $('#chat-right-sidebar').addClass('visible');
}

function closeChatWindow() {
    $('#chat-right-sidebar').removeClass('visible');
    getUserConversationalists();
}

function convertMessageToHtml(message, conversationalistId) {
    let chatBubbleOwner;
    if (message.from === conversationalistId) {
        chatBubbleOwner =
            '   <div class="chat-bubble them">\n' +
            '       <div class="chat-bubble-img-container">\n' +
            '            <img src="images/reader-girl.png" alt="">\n' +
            '       </div>\n';
    } else {
        chatBubbleOwner =
            '   <div class="chat-bubble me">\n';
    }
    return '   <div class="chat-start-date">' + message.dateTimeString + '</div>\n' +
        chatBubbleOwner +
        '       <div class="chat-bubble-text-container">\n' +
        '           <span class="chat-bubble-text">' + message.message + '</span>\n' +
        '       </div>' +
        '   </div>\n';
}

function openConversation(conversationalistId, userNameSurname) {
    if (newMessagesFrom.includes(conversationalistId)) {
        newMessagesFrom.pop(conversationalistId);
    }
    if (newMessagesFrom.length == 0) {
        allNewMessagesAreSeen();
    }
    console.log("open chat for user " + conversationalistId + ' ' + userNameSurname);
    openChatWindow();

    let token = getTokenFromLocalStorage();
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    $.get(MESSAGE_CONTROLLER + "/withUser/" + conversationalistId, function (response) {
        let messages = response;
        let messageDataHtml = '';
        for (let i = 0; i < messages.length; i++) {
            messageDataHtml += convertMessageToHtml(messages[i], conversationalistId);
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
            getCurrentUserId() + ', ' + conversationalistId + '); return false;">\n' +
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

function receiveMessage(event) {
    console.log('received event');
    console.log(insideTheList);

    let jsonObject = JSON.parse(event.body);
    if (!newMessagesFrom.includes(jsonObject.from)) {
        newMessagesFrom.push(jsonObject.from);
    }

    if (insideTheList) {
        appendNewMessage(jsonObject, jsonObject.from);
    } else {
        document.getElementById("envelope").style.color = 'darkorange';
    }
}

function closeDialogs() {
    insideTheList = false;
}

function appendNewMessage(message, conversationalistId) {
    $('.chat-write').remove();
    let newMessage = convertMessageToHtml(message, conversationalistId);
    newMessage +=
        '   <div class="chat-write">\n' +
        '       <form class="form-horizontal" action="#" onsubmit="sendMessage(' +
        getCurrentUserId() + ', ' + conversationalistId + '); return false;">' +
        '           <input type="text" id="chat-new-text" class="form-control" autocomplete="off" placeholder="Say something">\n' +
        '       </form>\n' +
        '   </div>';

    $('#to-be-scrolled').append(newMessage);
    $('#to-be-scrolled').scrollTop($('#to-be-scrolled')[0].scrollHeight);
    $('#chat-new-text').focus();
}

function allNewMessagesAreSeen() {
    document.getElementById("envelope").style.color = 'black';
    // getUserConversationalists();
}
