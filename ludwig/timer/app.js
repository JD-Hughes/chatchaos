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
    3000 : 25,
    "bits" : 10
}
const planTypes = {
    "Prime" : "Prime",
    1000 : "Tier 1",
    2000 : "Tier 2",
    3000 : "Tier 3",
    "bits" : 10
}

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
}

function addTime(seconds) {
    coutdownTime += seconds * 1000;
}

function addEvent(eventTitle, eventText, eventType) {
    var now = new Date().getTime();
    var distance = (coutdownTime - now);
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + (days * 24));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    distance = hours + ":" + minutes + ":" + pad(seconds,2);
    var element = `<span class="event-title">${eventTitle}</span><span class="event-text">${eventText}</span><span class="event-type">${eventType}</span><span class="event-time">${distance}</span><br>`
    eventViewer.innerHTML += element
}

function convertTime(totalseconds) {
    
    var day = 86400;
    var hour = 3600;
    var minute = 60;
    
    var daysout = Math.floor(totalseconds / day);
    var hoursout = pad(Math.floor((totalseconds - daysout * day)/hour),2);
    var minutesout = pad(Math.floor((totalseconds - daysout * day - hoursout * hour)/minute),2);
    var secondsout = pad(Math.floor(totalseconds - daysout * day - hoursout * hour - minutesout * minute),2);

    var dateString = `${daysout} Days ${hoursout}:${minutesout}:${secondsout}`;

    return dateString;
}

function updateTimeSince(now) {
    var secondsSince = (new Date(now - startTime).getTime())/1000;
    timeSinceStart.innerHTML = `Ludwig has been streaming for <b>${convertTime(secondsSince)}</b>`;
}
  
client.connect().then(() => {
    console.log(`Connected to: ${channel}`);
});

client.on("subscription", (channel, username, method, message, userstate) => {
    addTime(timeValues[method['plan']]);
    addEvent("SUB",username,planTypes[method['plan']])
});

client.on("resub", (channel, username, streakMonths, recipient, methods, userstate) => {
    addTime(timeValues[methods['msg-param-sub-plan']]);
    addEvent("RESUB",username,planTypes[methods['msg-param-sub-plan']])
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    addTime(timeValues[methods['plan']]);
    addEvent("GIFT SUB",`FROM ${username} TO ${recipient}`,planTypes[methods['plan']])
});

console.log(timeValues);

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
  updateTimeSince(now);
    
  // Find the distance between now and the count down date
  var distance = coutdownTime - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + (days * 24));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    // clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);