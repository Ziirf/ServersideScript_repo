const conf = require("./config/serverconf.json");
const {sendText, sendJSON, sendFile, redirect, logger, streamFile} = require("./utilities");
const api = {
    "cat" : require("./api/cat"),
    "duck" : require("./api/duck"),
};

module.exports = function(req, res) {
    logger(req, res);
    const url = new URL(req.url, `${conf.host}:${conf.port}`);

    const endpoint = url.pathname;
    if (endpoint === "/") {
        redirect(res, `${conf.host}:${conf.port}/html/index.html`);
        return;
    }

    regexCheck(/^\/(html|css|js|img)\/[\w-]+\.(html|css|js|jpe?g|png)/, endpoint, (result) => {
        sendFile(req, res, `${conf.docroot}${result[0]}`);
        return;
    })

    regexCheck(/^\/api\/(?<route>\w+)\/?(?<param>\d+)?$/, endpoint, (result) => {
        if (api[result.groups.route]) {
            if (api[result.groups.route][req.method]){
                api[result.groups.route][req.method].handler(req, res, result.groups.param);
                return;
            };
        };
    });
}

function regexCheck(regex, str, func) {
    const result = str.match(regex);

    if (result) {
        func(result);
    };
}