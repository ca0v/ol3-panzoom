function getParameterByName(name, url) {
    if (url === void 0) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
require.config({
    waitSeconds: 30,
    packages: [
        {
            name: "openlayers",
            location: "../bower_components/openlayers",
            main: "ol-debug.js"
        }
    ],
    callback: function () {
        var run = getParameterByName("run");
        run && require([run]);
    }
});
