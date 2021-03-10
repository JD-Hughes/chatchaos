function goToPage(destination) {
    var channelName = document.getElementById("channel-name").value.toUpperCase();
    const nameExeptions = ["html-background","vgm"]

    if (channelName === "" && !(nameExeptions.includes(destination))) {
        alert("Pleas enter a channel name");
    } else {
        switch (destination) {
            case "hangman":
                window.location.href = `hangman/?channel=${channelName}&overlay=${document.getElementById("hangman-overlay-mode").checked}`;
                break;

            case "vgm":
                window.location.href = `quiz`;
                break;

            case "active-chat":
                window.location.href = `active-chat/?channel=${channelName}&bg=${document.getElementById("active-chat-bg-color").value}`;
                break;

            case "html-background":
                window.location.href = `background/${document.getElementById("html-bg-type").value}/?text=${document.getElementById("html-bg-custom-text").value}`;
        };
    }
}