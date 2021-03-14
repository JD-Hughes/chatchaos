const changelogBody = document.getElementById("changelog");

function createHead(version,date , title) {
    const element = document.createElement('div');
    const versionElement = document.createElement('span');
    versionElement.className = "version-number";
    versionElement.innerHTML = `<h2>${version}</h2>`
    element.appendChild(versionElement);

    const dateElement = document.createElement('span');
    dateElement.className = "version-date";
    dateElement.innerHTML = `<h2>${date}</h2>`
    element.appendChild(dateElement);

    const versionTitle = document.createElement('span');
    versionTitle.className = "version-title";
    versionTitle.innerHTML = `<h2>${title}</h2>`
    element.appendChild(versionTitle);
    return element
}

function createBody(description, changes, notes) {
    const element = document.createElement('div');
    const descriptionElement = document.createElement('p');
    descriptionElement.className = "version-description";
    descriptionElement.innerText = `${description}`;
    element.appendChild(descriptionElement);

    if (changes['added'].length > 0) {
        const changeTitle = document.createElement('h2');
        changeTitle.innerText = "Added";
        element.appendChild(changeTitle);
        for (let i = 0; i < changes['added'].length; i++) {
            const change = changes['added'][i];
            const changeElement = document.createElement('li');
            changeElement.className = "version-change";
            changeElement.innerText = `${change}`;
            element.appendChild(changeElement);
        }
    }

    if (changes['updated'].length > 0) {
        const changeTitle = document.createElement('h2');
        changeTitle.innerText = "Updated";
        element.appendChild(changeTitle);
        for (let i = 0; i < changes['updated'].length; i++) {
            const change = changes['updated'][i];
            const changeElement = document.createElement('li');
            changeElement.className = "version-change";
            changeElement.innerText = `${change}`;
            element.appendChild(changeElement);
        }
    }

    if (changes['removed'].length > 0) {
        const changeTitle = document.createElement('h2');
        changeTitle.innerText = "Removed";
        element.appendChild(changeTitle);
        for (let i = 0; i < changes['removed'].length; i++) {
            const change = changes['removed'][i];
            const changeElement = document.createElement('li');
            changeElement.className = "version-change";
            changeElement.innerText = `${change}`;
            element.appendChild(changeElement);
        }
    }

    const notesElement = document.createElement('p');
    notesElement.className = "version-notes";
    notesElement.innerText = `${notes}`;
    element.appendChild(notesElement);
    return element
}

function buildDIV(data) {
    var mainDIV = document.createElement('div');
    mainDIV.id = `Version-${data['version']}`

    var versionHead = createHead(data['version'], data['date'], data['title'])
    versionHead.className = "version-head";

    var versionBody = createBody(data['description'], data['changes'], data['notes']);
    versionBody.className = "version-body";

    mainDIV.appendChild(versionHead);
    mainDIV.appendChild(versionBody);
    mainDIV.appendChild(document.createElement('hr'));
    return mainDIV
}

fetch(`log.json?nocache=${Math.random().toString().substring(2)}`)
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data['changelog'].length; i++) {
            var divElement = buildDIV(data['changelog'][i]);
            changelogBody.appendChild(divElement);
        }
    });