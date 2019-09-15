$(document).ready(function() {
    updateList();
});

$('#submitter').on("click", function() {
    let newUrl = $('#input').val().trim();
    if (newUrl === "") {
        return;
    }
    chrome.runtime.sendMessage({message: "block", url: newUrl}, response => console.log(response));
    $('#input').val("");
    chrome.storage.sync.get('urlBlacklist', function(result) {
        console.log(result)
        let curUrlList = result.urlBlacklist || [];
        curUrlList.push(newUrl);
        curUrlList.sort();
        chrome.storage.sync.set({'urlBlacklist': curUrlList}, function() {
            updateList();
        });
    });
});

updateList = () => {
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let list = result.urlBlacklist || [];
        $('#urlBlacklist').empty();
        list.forEach(element => {
            let x = document.createElement("BUTTON");
            x.classList.add("delete");
            x.innerHTML = "&times;";
            x.onclick = removeItem(element);
            let node = document.createElement("div");
            node.classList.add("urlListItem")
            node.appendChild(document.createTextNode(element));
            node.appendChild(x);
            $('#urlBlacklist').append(node);
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
