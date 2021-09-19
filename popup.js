let generateLink = document.querySelector('#generate');
console.log(generateLink)
let copyLinkBtn = document.querySelector('#copyLinkBtn');
let toastWarning = document.querySelector('.toast-warning')
let toastSuccess = document.querySelector('.toast-success')
let toastCopied = document.querySelector('.toast-primary')
let toastError = document.querySelector('.toast-error')
let toastClose = document.querySelector('#close')
let mainLabel = document.querySelector('#mainlabel')
let url = "http://localhost:5000/urlCombiner"

console.log(copyLinkBtn)
console.log(mainLabel)

var shortURL = "shortURL"

generateLink.addEventListener('click', () => {
    console.log("start generating link")
    closeToasts()
    toastWarning.classList.remove('d-hide')

    chrome.tabs.query({currentWindow: true, highlighted: true}, function (tabs) {
        fetch(apiCall).then(function(res) {
            closeToasts();
            if (res.status !== 200) {
                toastError.classList.remove('d-hide');
                return;
            }
            res.json().then(function(data) {
                // do stuff with data
                shortURL = "http://localhost:5000/" + data

                mainLabel.innerHTML = shortURL
                
                toastSuccess.classList.add('d-hide')

                generateURL.classList.add('d-hide');
                copyLinkBtn.classList.remove('d-hide');
                return;
            });
        }).catch(function(err) {
            closeToasts();
            toastError.classList.remove('d-hide');
            return;
        });
        closeToasts()
        toastWarning.classList.remove('d-hide')

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "fullUrl": tabs.map(x => x.url),
            })
        }).then(response => response.json())
            .then(json => {
                closeToasts()
                console.log(json)
                // shortURL = json

                mainLabel.innerHTML = shortURL
                
                toastSuccess.classList.remove('d-hide')
                generateURL.classList.add('d-hide')
                copyLinkBtn.classList.remove('d-hide');
                return;
            })
            .catch(err => {
                closeToasts();
                toastError.classList.remove('d-hide');
                return;
            })
    });  
});

copyLinkBtn.addEventListener('click', async () => {
    copyToClipboard()
});

mainLabel.addEventListener('click', async () => {
    if (!copyLinkBtn,classList.contains('d-hide')) {
        copyToClipboard()
    }
});

toastClose.addEventListener('click', async () => {
    closeToasts()
});

function copyToClipboard() {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    toastCopied.classList.remove('d-hide')
}

function closeToasts() {
    if (!toastError.classList.contains('d-hide')) {
        toastError.classList.add('d-hide')
    }
    if (!toastSuccess.classList.contains('d-hide')) {
        toastSuccess.classList.add('d-hide')
    }
    if (!toastWarning.classList.contains('d-hide')) {
        toastWarning.classList.add('d-hide')
    }
    if (!toastCopied,classList.contains('d-hide')) {
        toastCopied.classList.add('d-hide')
    }
}

let numOfTabs = 0;
// document.getElementById("numTabs").innerHTML = numOfTabs;

chrome.browserAction.onClicked.addListener(
function (tabs) {
    chrome.tabs.query({currentWindow: true, highlighted: true}, function (tabs) {
        numOfTabs = tabs.length;
    });
});