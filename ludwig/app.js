const displayArea = document.getElementById('display');

const validDays = ['D1'];

const testData = [
    { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
    { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
    { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
    { name: "Monte Amiata", height: 1738, place: "Siena" }
  ];

function generateTable(tableID, headers, data) {
    const tableElement = document.createElement('table');
    tableElement.id = tableID;
    let thead = tableElement.createTHead();
    let trow = thead.insertRow();
    for (let key of headers) {
        let th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        trow.appendChild(th);
    }
    for (let element of data) {
        let row = tableElement.insertRow()
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
    displayArea.appendChild(tableElement);
}

function showData(day) {
    if (!validDays.includes(day)) return // Validate requested day
    fetch(`reports/report-${day}.json`).then(r => r.text()).then(data => { // Request and parse json data for selected time period
        const reportData = JSON.parse(data);
        displayArea.innerText = null; // Clear the current display area
        console.log(reportData); //DEBUG
        generateTable("t-top-messages", ['Message', '# of uses'], reportData['topMessages']);
        generateTable("t-top-users", ['User', '# of messages'], reportData['topUsers']);
        generateTable("t-top-emotes", ['Emote', '# of uses'], reportData['topEmotes']);
        generateTable("t-top-hastags", ['Hashtag', '# of uses'], reportData['topHashtags']);
        generateTable("t-message-chains", ['# of chains', 'Message', 'Stopped By'], reportData['messageChains']);
    });
}
