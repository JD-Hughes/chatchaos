const displayArea = document.querySelector('.grid');
const subText = document.querySelector('.info-text');

const validRequests = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'W1'];
const validGraphics = ['D1', 'D2', 'D3', 'D4', 'D5'];

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function generateTable(tableID, headers, data, title) {
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
            let text = document.createTextNode(isNumber(element[key]) ? element[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : element[key]);
            cell.appendChild(text);
        }
    }
    const gridItem = document.createElement('div');
    const gridTitle = document.createElement('h2');
    gridTitle.className = 'grid-title';
    gridTitle.innerText = title;
    gridItem.className = 'grid-item';
    gridItem.appendChild(gridTitle);
    gridItem.appendChild(tableElement);
    return(gridItem)
}

function collectOtherData(reportData) {
    const uniqueUsers = ['Total Unique Users',reportData['totalUniqueUsers']];
    const validMessages = ['Total Messages',reportData['totalValidMessages']];
    return [validMessages,uniqueUsers]
}

function drawGraph(dataPoints) {
    var dataArray = [];
    var labelsArray = [];

    for (let i = 0; i < dataPoints.length; i++) {
        const element = dataPoints[i];
        labelsArray.push(element[0])
        dataArray.push(element[1])
    }

    var ctx = document.getElementById('msg-chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Messages per hour',
                borderColor: 'rgb(255, 99, 132)',
                data: dataArray
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Hours since start'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Messages per hour'
                    }
                }]
            }
        }
    });
}

function weeklySummary(reportData) {
    var summary = document.createElement('div');
    var container = document.createElement('div');
    var container2 = document.createElement('div');
    var container3 = document.createElement('div');
    var graph = document.createElement('canvas');
    graph.id = 'msg-chart';
    container.className = "hoz-container";
    container2.className = "hoz-container";
    container3.className = "hoz-container";
    container.appendChild(generateTable("t-top-messages", ['Message', '# of uses'], reportData['topUsers'], "Weekly Top Users"));
    container.appendChild(generateTable("t-top-emotes", ['Emote', '# of uses'], reportData['topEmote'], "Weekly Top Emotes"));
    summary.appendChild(graph);
    container2.appendChild(generateTable("t-totals-data", ['Data', 'Value'], reportData['totals'], "Totals"));
    container2.appendChild(generateTable("t-extra-data", ['Data', 'Times Said'], reportData['extraStats'], "Extra / Memes"));
    container3.appendChild(generateTable("t-top-hastags", ['Hashtag', '# of uses'], reportData['topHash'], "Weekly Top Hashtags"));
    container3.appendChild(generateTable("t-top-chains", ['# of Chains', 'Message', 'Interrupted By'], reportData['topChains'], "Weekly Top Message Chains"));
    summary.appendChild(container2);
    summary.appendChild(container);
    summary.appendChild(container3);
    summary.id = 'week-container';
    document.getElementById('main').appendChild(summary)
}

function showData(day) {
    displayArea.innerText = null; // Clear the current display area
    if (!validRequests.includes(day)) {  // Validate requested day
        displayArea.innerHTML = "";
        subText.innerHTML = `<span class='errorTXT'>This data does not exist <span style="font-size: 20px">(yet)</span></span>`;
        return
    }
    subText.innerHTML = `Viewing data: <b>${day}`;
    if (day.startsWith("W")) {
        fetch(`reports/report-${day}.json`).then(r => r.text()).then(data => { // Request and parse json data for selected time period
            const reportData = JSON.parse(data);
            weeklySummary(reportData);
            drawGraph(reportData['graphPoints']);
        });
        return
    }
    if (validGraphics.includes(day)) subText.innerHTML = `Viewing data: <b>${day}</b> <a href="reports/images/${day}.png" target="_blank">(View Infographic)</a>`;
    fetch(`reports/report-${day}.json`).then(r => r.text()).then(data => { // Request and parse json data for selected time period
        const reportData = JSON.parse(data);
        displayArea.appendChild(generateTable("t-top-messages", ['Message', '# of uses'], reportData['topMessages'], "Top Messages"));
        displayArea.appendChild(generateTable("t-top-users", ['User', '# of messages'], reportData['topUsers'], "Top Users"));
        displayArea.appendChild(generateTable("t-top-emotes", ['Emote', '# of uses'], reportData['topEmotes'], "Top Emotes"));
        displayArea.appendChild(generateTable("t-top-hastags", ['Hashtag', '# of uses'], reportData['topHashtags'], "Top Hashtags"));
        displayArea.appendChild(generateTable("t-message-chains", ['# of chains', 'Message', 'Stopped By'], reportData['messageChains'], "Longest Chains"));
        displayArea.appendChild(generateTable("t-other-data", ['Other Data', 'Value'], collectOtherData(reportData), "Totals"));
    });
    document.getElementById('week-container').remove();
}
