const chatText = document.querySelector('#chat');
const statusElement = document.querySelector('#status');

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel') || 'JH_Code';

const bttvAPI = "https://api.betterttv.net/3/cached/users/twitch/";

const bannedWords = [];
const ignoreEmoteOnly = true;
const ignoreCommands = true;
const subsOnly = false;
const arrayLength = 35;
const maxMessageLength = 0;

var chatMessages = [];
var chatUsers = [];
var repeatedMessages = {};
var bttvEmotes = {};

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: [channel],
});

client.connect().then(() => {
    statusElement.textContent = `Connected to: ${channel}... `;
    fetch(`https://api.betterttv.net/3/cached/emotes/global`)
            .then(response => response.json())
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    bttvEmotes[data[i]["code"]] = data[i]["id"];
                }
    });
    fetch(`https://api.twitch.tv/kraken/users?login=${channel}`, { method: 'GET', headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': 'ekj09tcx24qymrl1wl5c6er2qjkpryz'} })
    .then(response => response.json())
    .then(data => {
        if (data['users'].length === 1){
            var channelID = data['users'][0]["_id"]
            fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelID}`)
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length === 4){
                    for (var i = 0; i < data['sharedEmotes'].length; i++) {
                        bttvEmotes[data['sharedEmotes'][i]["code"]] = data['sharedEmotes'][i]["id"];
                    };
                    for (var i = 0; i < data['channelEmotes'].length; i++) {
                        bttvEmotes[data['channelEmotes'][i]["code"]] = data['channelEmotes'][i]["id"];
                    }
                } else console.log("BTTV Emotes are not enabled on this channel");
            });
        }
    });
    console.log("BTTV Emotes Imported:", bttvEmotes);
});

function validMessage(message, tags) {
    if (ignoreCommands && message.startsWith("!")) {
        return false;
    } else if (ignoreEmoteOnly && tags["emote-only"]) {
        return false;
    } else if (subsOnly && !tags.subscriber) {
        return false;
    } else if ((maxMessageLength > 0) && (message.length > maxMessageLength)) {
        console.log("Blocked long message", message.length, message)
        return false;
    } else return true;
};

function addEmotes(message) {
    var formattedMessage = "";
    var messageArray = message.split(" ");
    for (let i = 0; i < messageArray.length; i++) {
        if (Object.keys(bttvEmotes).includes(messageArray[i])){
            console.log("REPLACED EMOTE", messageArray[i], `<img src='https://cdn.betterttv.net/emote/${bttvEmotes[messageArray[i]]}/3x'>`);
            messageArray[i] = `<img src='https://cdn.betterttv.net/emote/${bttvEmotes[messageArray[i]]}/3x'>`;
        }
        formattedMessage = formattedMessage + messageArray[i] + " ";
    }
    return formattedMessage;
}

function printMessages(array) {
    var outText = "";
    for (var i = 0; i < array.length; i++) {
        // var emoteMessage = addEmotes(array[i]);
        if (Object.keys(repeatedMessages).includes(array[i])) {
            outText += `${array[i]} <span class="multiplier">(x${repeatedMessages[array[i]]})</span><br> `;
        } else outText += array[i] + " <br> ";
    }
    chatText.innerHTML = addEmotes(outText);
};

function removeMessages(message) {
    if (Object.keys(repeatedMessages).includes(message)) delete repeatedMessages[message];
}

client.on('message', (wat, tags, message, self) => {
    if (self) return;
    if (validMessage(message, tags)) {
        if (chatMessages.includes(message)){
            if (Object.keys(repeatedMessages).includes(message)) {
                repeatedMessages[message] = repeatedMessages[message] + 1;
            } else {
                repeatedMessages[message] = 2;
            }
        } else{
            chatMessages.push(message);
            chatUsers.push(tags.username);
        }
        if (chatMessages.length > arrayLength) {
            removeMessages(chatMessages.shift());
            chatUsers.shift();
        }
        printMessages(chatMessages);
    };
});