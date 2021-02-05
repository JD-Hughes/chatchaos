const mainText = document.querySelector('#text');

const params = new URLSearchParams(window.location.search);
const queryText = params.get('text') || '';

mainText.innerText = queryText;
if (queryText === '') mainText.style.display = "none";