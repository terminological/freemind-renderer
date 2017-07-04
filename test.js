const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromFile('./test/test.html' , {}).then( dom => {

    //console.log(dom.serialize());

    global.window = dom.window;
    global.document = dom.window.document;

    var fs = require('fs');

    var tmpCss = fs.readFileSync('./style.css', 'utf8');
    var styleEl = document.createElement("style");
    styleEl.textContent = tmpCss;
    document.head.appendChild(styleEl);

    var tmp = fs.readFileSync('./test/test.mm', 'utf8');
    var parseString = require('xml2js').parseString;
    parseString(tmp, function (err, data) {

        //console.log(JSON.stringify(data));

        // global.$ = require('jquery')(window);

        var FreemindRenderer = require('./index.js');

        //console.log(window.document.getElementById("citations").outerHTML);

        FreemindRenderer.createRadialMap(data, window.document.getElementById("target"));
        FreemindRenderer.createVerticalMap(data, window.document.getElementById("target2"));

        console.log(dom.serialize());

        window.close();

    });



}).catch(error => {
    console.log(error,'Promise error');
});

;
