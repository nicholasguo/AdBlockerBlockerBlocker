$(document).ready(function() {
    updateList();
});

$('#submitter').on("click", function() {
    let newUrl = $('#input').val();
    chrome.runtime.sendMessage({message: "block", url: newUrl}, response => console.log(response));
    $('#input').val("");
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let curUrlList = result.urlBlacklist || [];
        if (curUrlList.indexOf(newUrl) === -1) {
            curUrlList.push(newUrl);
            chrome.storage.sync.set({'urlBlacklist': curUrlList}, function() {
                updateList();
            });
        }
    });
});

updateList = () => {
    chrome.storage.sync.get('urlBlacklist', function(result) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let url = tabs[0].url;
            let isActive = false;
            let list = result.urlBlacklist || [];
            $('#urlBlacklist').empty();
            list.forEach(element => {
                let x = document.createElement("BUTTON");
                x.classList.add("delete");
                x.innerHTML = "&times;";
                x.onclick = removeItem(element);
                let node = document.createElement("li");
                node.appendChild(document.createTextNode(element));
                node.appendChild(x);
                $('#urlBlacklist').append(node);
                // check for activity
                if (url.match(httpsIfy(element)) || url.match(httpIfy(element))) {
                    isActive = true;
                }
            });
            if (isActive) {
                $('#status-circle')[0].classList.add("active-circle");
            } else {
                $('#status-circle')[0].classList.remove("active-circle");
            }
        });
    });
}

removeItem = (url) => () => {
    chrome.runtime.sendMessage({message: "allow", url: url}); 
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let curUrlList = result.urlBlacklist || [];
        curUrlList = curUrlList.filter(item => item !== url);
        chrome.storage.sync.set({'urlBlacklist': curUrlList}, function() {
            updateList();
        });
    });
}

const httpsIfy = (url) => "https://*." + url + "/*";

const httpIfy = (url) => "http://*." + url + "/*";