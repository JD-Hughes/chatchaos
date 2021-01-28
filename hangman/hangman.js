const wordDisplay = document.getElementById("word-display");
const statusElement = document.getElementById("status");
const toggleVisButton = document.getElementById("toggleVisBttn");
const wordInput = document.getElementById("word-input");
const validChars = /^[A-Z]+$/;

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel') || 'JD_Code';

var hiddenWord = '';
var foundChars = [];

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: [channel],
});

function displayWord() {
    var obscuredWord = '';
    for (let i = 0; i < hiddenWord.length; i++) {
        if (foundChars.includes(hiddenWord[i])) {
            obscuredWord = obscuredWord.concat(hiddenWord[i]);
        } else obscuredWord = obscuredWord.concat("_");
        if (i < hiddenWord.length - 1) obscuredWord = obscuredWord.concat(" ");
    }
    wordDisplay.innerText = obscuredWord;
    if (!obscuredWord.includes("_")) {
        wordDisplay.innerText = hiddenWord;
        wordDisplay.style.color = "#2ecc71";
    }
}

function guessLetter(letter) {
    if ((!foundChars.includes(letter.toUpperCase()) && (letter.length === 1) && (validChars.test(letter.toUpperCase())))) {
        foundChars.push(letter.toUpperCase());
        displayWord();
    }
}

function setWord(word) {
    if ((word.length > 3) && (word.length <= 20)) {
        if (validChars.test(word.toUpperCase())) {
            foundChars = [];
            hiddenWord = word.toUpperCase();
            wordDisplay.style.color = "#ffffff";
            displayWord();
        } else alert("Word can only contain letters");
    } else alert("Word length must be between 3 and 15 characters");
}

function toggleVis() {
    if (wordInput.type === "password") {
        wordInput.type = "text";
        toggleVisButton.value = "Hide";
    } else {
        wordInput.type = "password";
        toggleVisButton.value = "Show";
    }
}

client.connect().then(() => {
    statusElement.textContent = `Connected to: ${channel}`;
});

client.on('message', (channel, tags, message, self) => {
    if (self || !message.startsWith('!')) {
        return;
    }

    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'guess' && args.length === 1) {
        console.log(`Guess made (${tags.username}): ${args[0]}`);
        guessLetter(args[0]);
    } //else if (command === 'hello') {
    // } else if (command === 'dice') {
    // }
});