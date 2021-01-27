const wordDisplay = document.getElementById("word-display");
const validChars = /^[A-Z]+$/;

var hiddenWord = '';
var foundChars = [];

// function getRandomWord(characterLength : Integer) {
//     var fileName = `${characterLength}chars.txt`;
// }

function displayWord() {
    var obscuredWord = '';
    for (let i = 0; i < hiddenWord.length; i++) {
        if (foundChars.includes(hiddenWord[i])){
            obscuredWord = obscuredWord.concat(hiddenWord[i]);
        } else obscuredWord = obscuredWord.concat("_");
        if (i < hiddenWord.length-1) obscuredWord = obscuredWord.concat(" ");
    }
    wordDisplay.innerText = obscuredWord;
    if (!obscuredWord.includes("_")) {
        alert("FINISHED")
    }
}

function guessLetter(letter) {
    if ((!foundChars.includes(letter.toUpperCase()) && (letter.length === 1) && (validChars.test(letter.toUpperCase())))){
        foundChars.push(letter.toUpperCase());
        displayWord();
    }
}


function setWord(word) {
    if ((word.length > 3) && (word.length <= 20)) {
        if (validChars.test(word.toUpperCase())) {
            foundChars = [];
            hiddenWord = word.toUpperCase();
            displayWord();
        } else alert("Word can only contain letters");
    } else alert("Word length must be between 3 and 15 characters");
}