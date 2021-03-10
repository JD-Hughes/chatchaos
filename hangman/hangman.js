const wordDisplay = document.getElementById("word-display");
const statusElement = document.getElementById("status");
const toggleVisButton = document.getElementById("toggleVisBttn");
const wordInput = document.getElementById("word-input");
const randomLetterCount = document.getElementById("random-quantity");
const hangmanImage = document.getElementById("hangmanImages");
const showHangmanOption = document.getElementById("showHangmanCheckbox");
const leaderDIV = document.getElementById("leaderboard");
const leaderboardP = document.getElementById("leaderboard-scores");
const showLeaderboardOption = document.getElementById("showLeaderboardCheckbox");
const autoRandomOption = document.getElementById("autoRandomCheckbox");
const optionsDiv = document.getElementById("optionsDiv");

const params = new URLSearchParams(window.location.search);
const channel = params.get("channel") || "JH_Code";
const overlayMode = params.get("overlay") || "false";

const validChars = /^[A-Z]+$/;

var strikes = 0;
var hiddenWord = "";
var lettersGuessed = [];
var leaderboardScores = [];
var randomWords = [];


const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channel],
});

function importRandomWords(qty) {
  var randomWordsArray = [];
  return fetch("assets/words.json") //https://chatchaos.tv/hangman/assets/words.json OR assets/words.json
  .then((r) => r.text())
  .then((data) => {
    {
      const jsonFile = JSON.parse(data);
      for (let wordLength = 0; wordLength <= 15; wordLength++) {
        randomWordsArray.push([]);
        if (jsonFile[`length_${wordLength}`]) {
          var words = jsonFile[`length_${wordLength}`];
          for (let i = 0; i < qty; i++) {
            var randLineNum = Math.floor(Math.random() * words.length);
            randomWordsArray[wordLength].push(words[randLineNum]);
          }
        }
      }
    }
    randomWords = randomWordsArray;
    toggleOptions();
    return {data};
  });
}

function changeRandomValue(amount) {
  try {
    var amountInt = parseInt(randomLetterCount.innerText) + amount;
    if (amountInt <= 15 && amountInt >= 4) {
      randomLetterCount.innerText = amountInt;
    }
  } catch (error) {
    console.log(error);
    randomLetterCount.innerText = 5;
  }
}

function setRandomWord(wordLength) {
  try {
    var verifiedWordLength = wordLength || parseInt(randomLetterCount.innerText);
    if (!(verifiedWordLength <= 15 && verifiedWordLength >= 4)) {
      randomLetterCount.innerText = 5;
      verifiedWordLength = 5;
    }
    if (randomWords[verifiedWordLength].length === 0) {
      alert("Please refresh the page to load more random words");
    } else {
      setWord(randomWords[verifiedWordLength].pop());
    }
  } catch (error) {
    console.log(error);
    randomLetterCount.innerText = 5;
  }
}

function updateDisplay() {
  var obscuredWord = "";
  for (let i = 0; i < hiddenWord.length; i++) {
    if (lettersGuessed.includes(hiddenWord[i])) {
      obscuredWord = obscuredWord.concat(hiddenWord[i]);
    } else obscuredWord = obscuredWord.concat("_");
    if (i < hiddenWord.length - 1) obscuredWord = obscuredWord.concat(" ");
  }
  wordDisplay.innerText = obscuredWord;
  if (!obscuredWord.includes("_")) {
    wordDisplay.innerText = hiddenWord;
    wordDisplay.style.color = "#2ecc71";
    if (autoRandomOption.checked) {
      setTimeout(() => setRandomWord(Math.floor(Math.random() * 5) + 5), 1000);
    }
  }

  if (strikes <= 10) {
    hangmanImage.src = `assets/${strikes}.png`;
  }
}

function updateLeaderboard(username) {
  var updated = false;
  var pText = "";
  for (let i = 0; i < leaderboardScores.length; i++) {
    const element = leaderboardScores[i];
    console.log("Adding to leaderboard");
    if (element[0] === username) {
      element[1]++;
      updated = true;
    }
  }
  if (!updated) leaderboardScores.push([username, 1]);
  leaderboardScores = leaderboardScores.sort(function (a, b) {
    return b[1] - a[1];
  });
  for (let i = 0; i < Math.min(leaderboardScores.length, 5); i++) {
    pText =
      pText +
      `<b>${leaderboardScores[i][1]}</b> - ${leaderboardScores[i][0]} <br>`;
  }
  leaderboardP.innerHTML = pText;
}

function guessLetter(letter, username) {
  if (
    !lettersGuessed.includes(letter.toUpperCase()) &&
    letter.length === 1 &&
    validChars.test(letter.toUpperCase())
  ) {
    lettersGuessed.push(letter.toUpperCase());
    if (hiddenWord.includes(letter.toUpperCase())) {
      updateLeaderboard(username);
    } else strikes++;
    updateDisplay();
  }
}

function setWord(word) {
  if (!word) word = wordInput.value;
  if (word.length > 3 && word.length <= 15) {
    if (validChars.test(word.toUpperCase())) {
      lettersGuessed = [];
      hiddenWord = word.toUpperCase();
      strikes = 0;
      console.log(`Word Set: ${hiddenWord}`);
      wordDisplay.style.color = "#ffffff";
      updateDisplay();
    } else alert("Word can only contain letters");
  } else
    alert(
      "Word length must be between 3 and 15 characters (Yes there is a limit)"
    );
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

function toggleOptions() {
  optionsDiv.style.display = "none";
  if (overlayMode.toLowerCase() == "true") {
    showHangmanOption.checked = true;
    showLeaderboardOption.checked = true;
    autoRandomOption.checked = true;
    document.getElementById("word-set-control").style.display = "none";
    document.getElementById("options-control").style.display = "none";
    document.getElementById("play-area").style.height = "90%";
    document.getElementById("control-bar").style.height = "10%";
    document.getElementById("control-bar").style.minHeight = "50px";
  }
  if (showHangmanOption.checked) {
    hangmanImage.style.display = "block";
    optionsDiv.style.display = "flex";
  } else hangmanImage.style.display = "none";

  if (showLeaderboardOption.checked) {
    leaderDIV.style.display = "block";
    optionsDiv.style.display = "flex";
  } else leaderDIV.style.display = "none";

  if (
    autoRandomOption.checked &&
    wordDisplay.innerText === "TWITCH PLAYS HANGMAN"
  )
    setRandomWord(5);
}

client.connect().then(() => {
  statusElement.innerHTML = `Connected to: <span style="font-weight: bold">${channel}</span>`;
});

client.on("message", (channel, tags, message, self) => {
  if (self || !message.startsWith("!")) {
    return;
  }

  const args = message.slice(1).split(" ");
  const command = args.shift().toLowerCase();

  if (command === "guess" && args.length === 1) {
    // console.log(`Guess made (${tags["display-name"]}): ${args[0]}`);
    guessLetter(args[0], tags["display-name"]);
  }
});

importRandomWords(20);