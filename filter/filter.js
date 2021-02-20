const chatText = document.querySelector('#chat');
const statusElement = document.querySelector('#status');

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel') || 'JH_Code';

const bannedWords = [];
const ignoreEmoteOnly = false;
const ignoreCommands = true;
const subsOnly = false;
const arrayLength = 100;

var chatMessages = [];
var chatUsers = [];

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: [channel],
});

client.connect().then(() => {
    statusElement.textContent = `Connected to: ${channel}... `;
});

function validMessage(message, tags) {
    if (ignoreCommands && message.startsWith("!")) {
        return false;
    } else if (ignoreEmoteOnly && tags["emote-only"]) {
        return false;
    } else if (subsOnly && !tags.subscriber) {
        return false;
    } else return true;
};

function printMessages(array) {
    var outText = null;
    for (var i = 0; i < array.length; i++) {
        outText += array[i] + "<br>";
    }
    chatText.innerHTML = outText;
};

function debugStats(id = 0) { //DEBUG
    console.log(`MSG/USR: ${chatMessages.length} / ${chatUsers.length} || TOTAL: ${debugCount}`); //DEBUG
    console.log(`${chatUsers[id]}: ${chatMessages[id]} || ${debugMessages[id]}`); //DEBUG
    console.log(".........."); //DEBUG
}

var debugMessages = []; //DEBUG
var debugCount = 0; //DEBUG

client.on('message', (wat, tags, message, self) => {
    debugCount += 1;
    if (self) return;
    if (validMessage(message, tags)) {
        chatMessages.push(message);
        chatUsers.push(tags.username);
        debugMessages.push(`${tags.username}: ${message}`);
        if (chatMessages.length > arrayLength) {
            chatMessages.shift();
            chatUsers.shift();
            debugMessages.shift(); //DEBUG
        }
        printMessages(chatMessages);
        if ((debugCount % 55) == 0) debugStats(23); //DEBUG
    };
});

chatText.textContent = "HELLO";