const player = document.getElementById("video-player");
const inputField = document.getElementById("player-input");
const submitButton = document.getElementById("submit-btn");
const scoreEl = document.getElementById("score");

let videoID = null;
let playerScore = 0;

const searchOptions = { includeScore: true, threshold: 0.15 };

let movies = [
    { title: "Spectre", src: "kEnK0ZdMThc" },
    { title: "John Wick 2", src: "qIalODmFrZk", alt: ["John Wick"] },
    { title: "Baby Driver", src: "7ARFyrM6gVs" },
    { title: "Taken", src: "jZOywn1qArI" },
    { title: "The Social Network", src: "2BE2XhnZ_4g", alt: ["Social Network"] },
    { title: "Avengers: Infinity War", src: "EpI3x6gf2uA", alt: ["Infinity War", "Avengers Infinity War"] },
    {
        title: "Spider-man: Into the spider-verse",
        src: "oJyz1snRgOU",
        alt: [
            "spiderman Into the spiderverse",
            "Spiderman",
            "Into the spider verse",
            "Into the spiderverse",
            "spider-man Into the spiderverse",
            "spider man Into the spiderverse",
            "spider-man",
            "spider man",
        ],
    },
    { title: "Avengers: Endgame", src: "tdMaz-x8BAI", alt: ["Endgame", "Avengers Endgame"] },
    { title: "X-Men: Days of future past", src: "T9GFyZ5LREQ", alt: ["xmen", "days of future past"] },
    { title: "Deadpool", src: "TMHPKUeDWBw" },
    { title: "Tenet", src: "4xj0KRqzo-0" },
    { title: "The Dark Knight", src: "H6iEH-qgld0", alt: ["Batman The Dark Knight", "Batman: The Dark Knight"] },
    { title: "Inception", src: "TAbbJT0ZXmk" },
    { title: "The Avengers", src: "SLD9xzJ4oeU", alt: ["Avengers"] },
    { title: "Mission Impossible: Ghost Protocol", src: "qtA0JS1lBaY", alt: ["Mission Impossible", "Ghost Protocol", "Mission Impossible Ghost Protocol", "MI Ghost Protocol", "MI: Ghost Protocol"] },
    { title: "Mission Impossible: Fallout", src: "hhLIwmgx3vI", alt: ["Mission Impossible", "Fallout"] },
    { title: "Legend", src: "zZ7AWVKbPWY" },
    { title: "The Matrix", src: "zE7PKRjrid4" },
    { title: "Madagascar", src: "kPE7ZCGjw4o" },
    { title: "Bee Movie", src: "L46syxgju18" },
    { title: "How to train your dragon", src: "nPmIhH775L4" },
    { title: "Ghostbusters", src: "7_pR6mUYtOo" },
    { title: "Baywatch", src: "WDuIl_uPY_s" },
    { title: "Now you see me 2", src: "YmGBAiHnK0U", alt: ["Now you see me"] },
    {
        title: "Pirates of the Caribbean: Dead Man's Chest",
        src: "9smFLklOmlY",
        alt: ["Pirates of the Caribbean", "Dead Man's Chest", "Pirates of the Caribbean Dead Man's Chest", "Pirates of the Caribbean: Dead Mans Chest", "Pirates of the Caribbean Dead Mans Chest"],
    },
    { title: "Anchorman: The Legend of Ron Burgundy", src: "ipsPgNEmAXI", alt: ["Anchorman"] },
    { title: "Ace Ventura", src: "khyXMXFSufE" },
    { title: "Shrek 2", src: "A_HjMIjzyMU" },
    { title: "The Incredibles", src: "IRPI3lSACFc" },
    { title: "Despicable Me", src: "8R1OS5jPh2s" },
    { title: "Kung Fu Panda", src: "Jy2_J5WCzDY", alt: ["Kung-fu Panda", "Kungfu Panda"] },
    { title: "Ratatouille", src: "IojkKlmwnOE" },
    { title: "Guardians Of The Galaxy", src: "YVTXTPYsNDY", alt: ["Guardians"] },
    { title: "Whiplash", src: "xDAsABdkWSc" },
    { title: "The Lion King", src: "BAoCYwefq1A", alt: ["Lion King"] },
    { title: "Back to the future", src: "FWG3Dfss3Jc" },
    { title: "Django Unchained", src: "t1beG9Y6I9c", alt: ["Django"] },
    { title: "Hot Fuzz", src: "Cun-LZvOTdw" },
    { title: "Knives Out", src: "xNwQyNMSUmg" },
    {
        title: "Harry Potter and the Deathly Hallows: Part 1",
        src: "R2zNRrOXbPY",
        alt: [
            "Harry Potter",
            "Deathly Hallows",
            "The Deathly Hallows",
            "Deathly Hallows: Part 1",
            "The Deathly Hallows: Part 1",
            "Harry Potter Deathly Hallows",
            "Harry Potter and the Deathly Hallows",
            "Harry Potter Deathly Hallows Part 1",
            "Harry Potter Deathly Hallows: Part 1",
            "Harry Potter and the Deathly Hallows Part 1",
            "Harry Potter and the Deathly Hallows: Part 2",
            "Harry Potter and the Deathly Hallows Part 2",
        ],
    },
    { title: "Inside Out", src: "ISaHt3ps1dM" },
    { title: "The Martian", src: "IDnUUJqdg-w", alt: ["Martian"] },
    { title: "Sherlock Holmes: A Game of Shadows", src: "qy6Kh5dkTeo", alt: ["Sherlock Holmes", "Sherlock Holmes A Game of Shadows"] },
    { title: "Sully", src: "fJ5ZLdJDBrg" },
    { title: "Forrest Gump", src: "gAw9Ps-jwzM", alt: ["Forest Gump"] },
    { title: "Venom", src: "UCGdsPwcKKg" },
    { title: "Shark Tale", src: "TxV4VUWk1fA" },
    { title: "Coach Carter", src: "6p3GaCwvUoE" },
    { title: "Pitch Perfect", src: "hGdz2rMbTIM" },
    { title: "Kingsman: The Secret Service", src: "HDJEyqNw-9k", alt: ["Kingsman", "Kingsman the secret service"] },
    { title: "Law Abiding Citizen", src: "7uR5PyoLa3o" },
    { title: "Fight Club", src: "PXcEPSUl0uE" },
    { title: "Casino Royale", src: "iZxNbAwY_rk" },
    { title: "300", src: "70aq-TyeLf8" },
    { title: "Indiana Jones and the Raiders of the Lost Ark", src: "mC1ikwQ5Zgc", alt: ["Indiana Jones", "Raiders of the Lost Ark"] },
    { title: "The Great Escape", src: "O-qHlz4hfak", alt: ["Great Escape"] },
    { title: "Les Misérables", src: "ojoC-Kbzpo8", alt: ["Les Miserables"] },
    { title: "Love Actually", src: "cfNzZre-sIU" },
    { title: "Mamma Mia", src: "QRoWiTcO7dk" },
    { title: "2012", src: "S1Kbym7WYzs" },
    { title: "Star Trek: Into Darkness", src: "MvQBlk50UMA", alt: ["Star Trek", "Into Darkness", "Star Trek Into Darkness"] },
    { title: "Scarface", src: "a_z4IuxAqpE" },
    { title: "Wonder Woman", src: "pJCgeOAKXyg" },
    { title: "Rocky", src: "_YYmfM2TfUA" },
    { title: "The Italian Job", src: "sOGhuhC4AF0", alt: ["Italian Job"] },
    { title: "Blades of Glory", src: "sPFRZP4qY7I" },
    { title: "Home alone", src: "S7OWoc-j8qQ" },
    { title: "Pokémon Detective Pikachu", src: "Jwasv_AImtI", alt: ["Pokemon Detective Pikachu", "Detective Pikachu"] },
    { title: "Atomic Blonde", src: "DxCjqhDD7X4" },
    { title: "Airplane!", src: "FNkpIDBtC2c", alt: ["Airplane", "Aeroplane"] },
    { title: "Crocodile Dundee", src: "dSnosk4tWrg" },
    { title: "The Greatest Showman", src: "g9r5PFZihC4" },
    { title: "Titanic", src: "RXii-MAqt5E" },
    { title: "Ocean's Thirteen", src: "7oM7-Jsa168", alt: ["Oceans Thirteen", "Ocean's 13", "Oceans 13"] },
    { title: "Finding Nemo", src: "XWuPGKLJXe8" },
    { title: "Night at the museum", src: "fHrxjYMRJ4Q" },
    { title: "Avatar", src: "yHoB54D2DM4" },
    { title: "WALL-E", src: "RYMfE1i5MC8", alt: ["WALLE", "WALL E", "WALLIE"] },
    { title: "Grease", src: "pj-78jmpUHg" },
    { title: "Dodgeball", src: "peUyLXrgYZ0" },
    { title: "Up", src: "0WC3m6rfIMY" },
    { title: "E.T.", src: "oR1-UFrcZ0k", alt: ["ET", "E T", "E.T"] },
    { title: "The Shawshank Redemption", src: "B1KsZo_f0YE", alt: ["Shawshank", "Shawshank Redemption"] },
    { title: "Good Will Hunting", src: "GW9YZcn8Tik" },
    { title: "Ted", src: "rrJMRcsuUVA" },
    { title: "Bruce Almighty", src: "ICloNwrg-_w" },
    { title: "Interstellar", src: "pHFYSLjKLRg" },
    { title: "21 Jump Street", src: "LChzxQtCw8A" },
    { title: "Frozen", src: "H-_Wx7VETxE" },
    { title: "Big Hero 6", src: "uEeBXUUOBiI", alt: ["Big Hero Six"] },
    { title: "Borat", src: "WHsRzZrXC9k" },
    { title: "The Lord of the Rings: The Fellowship of the Ring", src: "VlaiBeLrntQ", alt: ["The Lord of the Rings", "Lord of the Rings"] },
    { title: "School of Rock", src: "_Tf_smu76T0", alt: ["The School of Rock"] },
    { title: "Iron Man", src: "PvYhZT99g1s" },
    { title: "Spider-Man 2", src: "yAZFFrisoD4", alt: ["Spiderman 2", "Spider man 2", "Spiderman", "Spider man", "Spider-man"] },
    { title: "Battleship", src: "nCqDdsZY7RA" },
    { title: "Top Gun", src: "KPxDoFbsvWA", alt: ["Topgun", "Top-Gun"] },
    { title: "Jurassic Park", src: "PJlmYh27MHg" },
    { title: "Men In Black", src: "0ayyXzZUgi0" },
    { title: "Jumanji: Welcome to the Jungle", src: "C0NVo07t9UI", alt: ["Jumanji"] },
];

function changeButton(mode) {
    if (movies.length < 1) {
        submitButton.innerText = "That's it! No more clips :(";
        submitButton.style.background = "rgb(0, 148, 247)";
        submitButton.disabled = true;
        scoreEl.innerHTML = `Score: <strong>${playerScore}</strong> out of <strong>${totalMovies}</strong>`;
        return;
    }
    if (mode == "next") {
        submitButton.onclick = function () {
            changeSRC();
            changeButton("reveal");
        };
        submitButton.innerText = "Next Video";
        submitButton.style.background = "Green";
        submitButton.focus();
    } else {
        submitButton.onclick = function () {
            revealAnswer();
        };
        submitButton.innerText = "Reveal Answer";
        submitButton.style.background = "Red";
        inputField.focus();
    }
}

function updateScore(amount) {
    playerScore = playerScore + amount;
    scoreEl.innerHTML = `Score: <strong>${playerScore}</strong>`;
}

function revealAnswer() {
    inputField.style.color = "rgb(74, 159, 255)";
    inputField.style.textAlign = "center";
    inputField.disabled = "true";
    inputField.value = movies[videoID]["title"];
    movies.splice(videoID, 1);
    changeButton("next");
}

function changeSRC() {
    videoID = Math.floor(Math.random() * movies.length);
    let newSRC = `https://www.youtube.com/embed/${movies[videoID]["src"]}?autoplay=1&modestbranding=1&controls=0&mute=0&rel=0`;
    player.src = newSRC;
    inputField.style.color = "white";
    inputField.style.textAlign = "left";
    inputField.disabled = false;
    inputField.value = "";
}

function playLast() {
    videoID = movies.length - 1;
    let newSRC = `https://www.youtube.com/embed/${movies[videoID]["src"]}?autoplay=1&modestbranding=1&controls=0&mute=0&rel=0`;
    player.src = newSRC;
}

function compareString(inputString, comparisonList) {
    var score = 1;
    const fuse = new Fuse(comparisonList, searchOptions);
    const fuseSearch = fuse.search(inputString)[0];
    if (fuseSearch) {
        const fuseScore = fuseSearch["score"];
        const lengthScore = Math.abs(inputString.length - fuseSearch["item"].length) / fuseSearch["item"].length;
        score = (fuseScore + lengthScore) / 2;
    }
    return score;
}

function checkAnswer() {
    var titleAnswers = [];
    titleAnswers.push(movies[videoID]["title"]);
    if (movies[videoID]["alt"]) {
        for (let k = 0; k < movies[videoID]["alt"].length; k++) {
            titleAnswers.push(movies[videoID]["alt"][k]);
        }
    }
    score = compareString(inputField.value, titleAnswers);
    submitButton.disabled = true;
    setTimeout(() => {
        submitButton.disabled = false;
        if (score < 0.1) submitButton.focus();
    }, 140);
    if (score < 0.1) {
        inputField.style.color = "rgb(104, 255, 74)";
        inputField.style.textAlign = "center";
        inputField.disabled = true;
        inputField.value = movies[videoID]["title"];
        movies.splice(videoID, 1);
        updateScore(1);
        changeButton("next");
    } else if (score < 0.25) {
        inputField.style.color = "Orange";
    } else {
        inputField.style.color = "Red";
    }
}
let totalMovies = movies.length;
console.log("Movies:", totalMovies);
changeSRC();
//playLast();
