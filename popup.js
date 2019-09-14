$(document).ready(function() {
    updateList();
});

$('#submitter').on("click", function() {
    let newUrl = "https://*." + $('#input').val() + "/*";
    chrome.runtime.sendMessage({message: "block", url: newUrl});
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
            $('#urlBlacklist').append(
                "<li>" + element + "</li>"
            );
        });
    });
}