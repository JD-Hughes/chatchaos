const timerElement = document.querySelector('#timer');
const timeSinceStart = document.querySelector('#time-since-start');
const eventViewer = document.querySelector('#event-viewer');
const channel = "ludwig";
const startTime = new Date('2021-03-14T20:25:00.00Z').getTime()
const timeValues = {
    "init" : 600,
    "Prime" : 10,
    1000 : 10,
    2000 : 20,
    3000 : 50,
}
const planTypes = {
    "Prime" : "Prime",
    1000 : "Tier 1",
    2000 : "Tier 2",
    3000 : "Tier 3",
}
var botSubCount = null;
var csvFileData = [];  
var csv5MinData = [];
var subData5 = {
    "sub" : 0,
    "resub" : 0,
    "giftsub" : 0,
    "bits" : 0
};

var coutdownTime = new Date().getTime();

const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channel],
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

function setTimer() {
    const hours = document.querySelector('#inputHours').value * 60 * 60 * 1000;
    const minutes = document.querySelector('#inputMinutes').value * 60 * 1000;
    const seconds = document.querySelector('#inputSeconds').value * 1000;
    const newTime = new Date().getTime() + new Date(hours + minutes + seconds).getTime();
    coutdownTime = newTime;
    addEvent("TIME UPDATED","-", "NEW TIME:");
}

function addTime(seconds) {
    coutdownTime += seconds * 1000;
}

function addEvent(eventTitle, eventText, eventType) {
    var now = new Date().getTime();
    var eventTimeStamp = convertTime((new Date(now - startTime).getTime())/1000);
    var distance = (coutdownTime - now);
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + (days * 24));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    distance = hours + ":" + pad(minutes,2) + ":" + pad(seconds,2);
    var htmlElement = `<span class="event-timestamp">${eventTimeStamp}</span><span class="event-title">${eventTitle}</span><span class="event-text">${eventText}</span><span class="event-type">${eventType}</span><span class="event-time">${distance}</span><br>`
    var csvElement = [eventTimeStamp, eventTitle,eventText,eventType,distance];
    csvFileData.push(csvElement)
    eventViewer.innerHTML += htmlElement
}

function convertTime(totalseconds) {
    
    var day = 86400;
    var hour = 3600;
    var minute = 60;
    
    var daysout = Math.floor(totalseconds / day);
    var hoursout = (Math.floor((totalseconds - daysout * day)/hour));
    var minutesout = (Math.floor((totalseconds - daysout * day - hoursout * hour)/minute));
    var secondsout = (Math.floor(totalseconds - daysout * day - hoursout * hour - minutesout * minute));

    var dateString = `${(daysout*24)+hoursout}:${pad(minutesout,2)}:${pad(secondsout,2)}`;

    return dateString;
}

function updateTimeSince(now) {
    var secondsSince = (new Date(now - startTime).getTime())/1000;
    return convertTime(secondsSince)
}
  
client.connect().then(() => {
    console.log(`Connected to: ${channel}`);
});

client.on('message', (wat, tags, message, self) => {
    if (self) return;
    if ((tags.username == "streamelements") && (message.startsWith("Current sub count:"))){
        botSubCount = message.split(" ")[3]
    }
});

client.on("subscription", (channel, username, method, message, userstate) => {
    addTime(timeValues[method['plan']]);
    addEvent("SUB",username,planTypes[method['plan']]);
    subData5['sub']++;
});

client.on("resub", (channel, username, streakMonths, recipient, methods, userstate) => {
    addTime(timeValues[methods['msg-param-sub-plan']]);
    addEvent("RESUB",username,planTypes[methods['msg-param-sub-plan']]);
    subData5['resub']++;
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    addTime(timeValues[methods['plan']]);
    addEvent("GIFT SUB",`${username} >> ${recipient}`,planTypes[methods['plan']]);
    subData5['giftsub']++;
});

client.on("cheer", (channel, userstate, message) => {
    // console.log(channel, userstate['bits'], message);
    addTime(Math.floor(userstate['bits']/100)*2);
    addEvent("CHEER",`${userstate['username']}`,`${userstate['bits']} BITS`);
    subData5['bits']+= parseInt(userstate['bits']);
});

const getViewerCount = async () => {
    var origin = window.location.protocol + '//' + window.location.host;
    const response = await fetch('https://thingproxy.freeboard.io/fetch/http://tmi.twitch.tv/group/user/ludwig?nochache='+Math.floor(Math.random()*10000), {headers:{"Accept":"application/json","Origin":origin}});
    const json = await response.json();
    var chatterCount = await json['chatter_count'];
    return await chatterCount
}

function calculate5minsubs(now, streamtime, timer) {
    var mins = new Date(now - startTime).getMinutes();
    var prevEntryMins = csv5MinData.length-1 >= 0 ? csv5MinData[csv5MinData.length-1][0].split(':')[1] : null;
    var currEntryMins = streamtime.split(':')[1]
    if ((mins % 1 == 0) && (prevEntryMins != currEntryMins)){
        var data = [streamtime,timer,subData5['sub'],subData5['resub'],subData5['giftsub'],subData5['bits']];
        getViewerCount().then(function(viewerCount){data.push(viewerCount,botSubCount)});
        csv5MinData.push(data);
        subData5['sub'] = 0;
        subData5['resub'] = 0;
        subData5['giftsub'] = 0;
        subData5['bits'] = 0;
    }
}

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
  timeSinceStart.innerHTML = `Ludwig has been streaming for <b>${updateTimeSince(now)}</b>`;;
    
  // Find the distance between now and the count down date
  var distance = coutdownTime - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + (days * 24));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  calculate5minsubs(now,updateTimeSince(now),`${hours}:${minutes}:${seconds}`);
    
  // Output the result in an element with id="demo"
  document.getElementById("timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    // clearInterval(x);
    document.getElementById("timer").innerHTML = "Time < 0";
  }
}, 1000);


/// =================================== ///

//create CSV file data in an array  
     
 //create a user-defined function to download CSV file   
function download_csv_file(type) {  
    switch (type) {
        case "all":
            var csv = 'Time (Since Live Started),Event,Username,Tier,Timer\n'; 
            var data = csvFileData;
            break;

        case "5min":
            var csv = 'Time (Since Live Started),Timer,Subs,Resubs,Gift Subs,Total Bits,Viewer Count,Bot Sub Count\n'; 
            var data = csv5MinData;
            break;
    }  
    
    //merge the data with CSV  
    data.forEach(function(row) {  
            csv += row.join(',');  
            csv += "\n";  
    });  

    //display the created CSV data on the web browser   
//  document.write(csv);  

    
    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv); 
    hiddenElement.target = '_blank';
    hiddenElement.setAttribute('target','_new')
    
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'output.csv';
    hiddenElement.click();  
}  

function clearEvents() {
    eventViewer.innerHTML = "";
    csvFileData = [];
    csv5MinData = [];
}
