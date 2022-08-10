const {readFile, createReadStream} = require("fs");
const { extname } = require("path");
const { hrtime } = require("process");

exports.sendText = function(req, res, msg, status = 200) {
    res.statusCode = status;
    res.setHeader("Content-type", "text/plain");
    res.end(msg);
}

exports.sendJSON = function(req, res, obj, status = 200) {
    res.statusCode = status;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(obj));
}

exports.sendFile = function(req, res, filename) {
    readFile(filename, function(err, filecontent) {
        if(err) {
            exports.sendJSON(req, res, {"error": err.message}, 404);
            return;
        }

        res.statusCode = 200;
        // res.setHeader("Content-type", "text/html");
        res.end(filecontent);
    })
}

exports.streamFile = function(req, res, filename) {
    const ext = extname(filename);
    const type = mimetypes[ext].type;
    const stream = createReadStream(filename);
    stream.on("error", function(err) {
        console.log(err);
        exports.sendJSON(req, res, {error: {msg: "Something went wront"}}, 404);
        return;
    });
    res.statusCode = 200;
    res.setHeader("Content-type",type);
    stream.pipe(res);
}

exports.redirect = function(res, url) {
    res.statusCode = 301;
    res.setHeader("Location", url);
    res.end();
}

exports.logger = function(req, res) {
    const startTime = hrtime.bigint();
    let logStr = `[${new Date().toLocaleString()}] ${req.method}: ${req.url}`;
    res.on("finish", function(){
        const duration = Number(hrtime.bigint() - startTime) /  1000000;
        logStr += ` [${res.statusCode} ${res.statusMessage}]  -  ${duration}ms`;
        console.log(logStr);
    })
}
