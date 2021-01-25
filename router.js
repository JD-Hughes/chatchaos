function goToPage(destination) {
    var channelName = document.getElementById("channel-name").value;
    console.log(channelName);

    if (channelName === "") {
        alert("Pleas enter a channel name");
    } else {
        window.location.href = `/${destination}/?channel=${channelName}`;
    }
}