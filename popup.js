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
            let url = element.substring(10, element.length - 2);
            let x = document.createElement("BUTTON");
            x.classList.add("delete");
            x.innerHTML = "&times;";
            x.onclick = removeItem(element);
            let node = document.createElement("li");
            node.appendChild(document.createTextNode(url));
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
