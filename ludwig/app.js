const displayArea = document.querySelector('.grid');
const subText = document.querySelector('.info-text');

const validDays = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

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
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.appendChild(tableElement);
    displayArea.appendChild(gridItem);
}

function collectOtherData(reportData) {
    const uniqueUsers = ['Total Unique Users',reportData['totalUniqueUsers']];
    const validMessages = ['Total Messages',reportData['totalValidMessages']];
    return [validMessages,uniqueUsers]
}

function showData(day) {
    if (!validDays.includes(day)) {  // Validate requested day
        displayArea.innerHTML = "";
        subText.innerHTML = `<span class='errorTXT'>This data does not exist <span style="font-size: 20px">(yet)</span></span>`;
        return
    }
    subText.innerHTML = `Viewing data: <b>${day}</b> <a href="reports/images/${day}.png" target="_blank">(View Infographic)</a>`;
    fetch(`reports/report-${day}.json`).then(r => r.text()).then(data => { // Request and parse json data for selected time period
        const reportData = JSON.parse(data);
        displayArea.innerText = null; // Clear the current display area
        generateTable("t-top-messages", ['Message', '# of uses'], reportData['topMessages']);
        generateTable("t-top-users", ['User', '# of messages'], reportData['topUsers']);
        generateTable("t-top-emotes", ['Emote', '# of uses'], reportData['topEmotes']);
        generateTable("t-top-hastags", ['Hashtag', '# of uses'], reportData['topHashtags']);
        generateTable("t-message-chains", ['# of chains', 'Message', 'Stopped By'], reportData['messageChains']);
        generateTable("t-other-data", ['Other Data', 'Value'], collectOtherData(reportData));
    });
}
