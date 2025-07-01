function getQueryParams() {
    var params = {};
    window.location.search.substring(1).split("&").forEach(function(pair) {
        var keyValue = pair.split("=");
        if (keyValue.length === 2) {
            params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
        }
    });
    return params;
}

window.onload = function() {
    var params = getQueryParams();
    if (params.name) {
        var usernameInput = document.getElementById("username");
        usernameInput.value = params.name;
        alert("Welcome " + params.name + "! Please enter your password to login.");
    }
};