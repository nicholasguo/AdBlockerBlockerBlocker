$(document).ready(function() {
    updateList();
});

$('#submitter').on("click", function() {
    let newUrl = "https://*." + $('#input').val() + "/*";
    chrome.runtime.sendMessage({message: "block", url: newUrl}, response => console.log(response));
    $('#input').val("");
    chrome.storage.sync.get('urlBlacklist', function(result) {
        let curUrlList = result.urlBlacklist || [];
        curUrlList.push(newUrl);
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
            let node = document.createElement("li");
            node.appendChild(document.createTextNode(element));
            node.onclick = removeItem(element);
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
