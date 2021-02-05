function goToPage(destination) {
    var channelName = document.getElementById("channel-name").value;

    if (channelName === "" && !(destination === "html-background")) {
        alert("Pleas enter a channel name");
    } else {
        switch (destination) {
            case "hangman":
                window.location.href = `hangman/?channel=${channelName}`;
                break;

            case "active-chat":
                window.location.href = `active-chat/?channel=${channelName}&bg=${document.getElementById("active-chat-bg-color").value}`;
                break;

            case "html-background":
                window.location.href = `background/${document.getElementById("html-bg-type").value}/?text=${document.getElementById("html-bg-custom-text").value}`;
        };
    }
}