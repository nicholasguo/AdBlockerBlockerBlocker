const defaults = [
    "bloomberg.com",
    "bostonglobe.com",
    "businessinsider.com",
    "economist.com", 
    "forbes.com",
    "medium.com",
    "newyorker.com",
    "nytimes.com", 
    "techcrunch.com",
    "washingtonpost.com", 
  ];

$(document).ready(function() {
    updateList();
});

addUrl = (newUrl, callback) => {
    chrome.runtime.sendMessage({message: "block", url: newUrl});
    $('#input').val("");
    chrome.storage.sync.get('urlBlacklist', function(result) {
        console.log(result)
        let curUrlList = result.urlBlacklist;
        if (curUrlList.indexOf(newUrl) === -1) {
            curUrlList.push(newUrl);
            curUrlList.sort();
            chrome.storage.sync.set({'urlBlacklist': curUrlList}, function() {
                callback();
            });
        }
    });
}

removeItem = (url, callback) => {
    chrome.runtime.sendMessage({message: "allow", url: url});
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let curUrlList = result.urlBlacklist || [];
        curUrlList = curUrlList.filter(item => item !== url);
        chrome.storage.sync.set({'urlBlacklist': curUrlList}, function() {
            callback();
        });
    });
}

$('#submitter').on("click", function() {
    let newUrl = $('#input').val().trim();
    if (newUrl === "") {
        return;
    }
    addUrl(newUrl, function() {
        updateList();
    });
});

$('#blacklist').on("click", function() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var curUrl = tabs[0].url;
        if (curUrl) {
            let i = curUrl.lastIndexOf("//") + 2;
            let j = i
            while (j < curUrl.length && curUrl.charAt(j) !== '/' ) {
                j += 1;
            }
            addUrl(curUrl.substring(i, j), function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.update(tabs[0].id, {url: tabs[0].url}, function() {
                        updateList();
                    });
                });
            });
        }
    });
});

$('#whitelist').on("click", function() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var curUrl = tabs[0].url;
        if (curUrl) {
            let i = curUrl.lastIndexOf("//") + 2;
            let j = i
            while (j < curUrl.length && curUrl.charAt(j) !== '/' ) {
                j += 1;
            }
            removeItem(curUrl.substring(i, j), function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.update(tabs[0].id, {url: tabs[0].url}, function() {
                        updateList();
                    });
                });
            });
        }
    });
});

updateList = () => {
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let list = result.urlBlacklist;
        $('#urlBlacklist').empty();
        if (!Array.isArray(list)) {
            list = defaults;
            chrome.storage.sync.set({'urlBlacklist': list});
        }
        list.forEach(element => {
            let x = document.createElement("BUTTON");
            x.classList.add("delete");
            x.innerHTML = "&times;";
            x.onclick = function() {removeItem(element, updateList);};
            let node = document.createElement("div");
            node.classList.add("urlListItem")
            node.appendChild(document.createTextNode(element));
            node.appendChild(x);
            $('#urlBlacklist').append(node);
        });
    });
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let url = tabs[0].url;
        chrome.contentSettings.javascript.get({primaryUrl: url}, function(jsSetting) {
            if (jsSetting.setting === "block") {
                $('#status-circle')[0].classList.add("active-circle");
                $('#blacklist')[0].style.display = "none";
                $('#whitelist')[0].style.display = "";
                chrome.browserAction.setBadgeText({text: "ON", tabId: tabs[0].tabId});
            } else {
                $('#status-circle')[0].classList.remove("active-circle");
                $('#blacklist')[0].style.display = "";
                $('#whitelist')[0].style.display = "none";
                chrome.browserAction.setBadgeText({text: "", tabId: tabs[0].tabId});
            }
        });
    });
}
