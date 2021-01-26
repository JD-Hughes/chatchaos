function goToPage(destination) {
    var channelName = document.getElementById("channel-name").value;
    var backgroundColor = document.getElementById("bg-color").value;
    console.log(channelName);

    if (channelName === "") {
        alert("Pleas enter a channel name");
    } else {
        window.location.href = `${destination}/?channel=${channelName}&bg=${backgroundColor}`;
    }
}