const {readFile, createReadStream} = require("fs");
const { extname } = require("path");
const { hrtime } = require("process");
const mimetypes = require("./mimetypes")

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
	const extension = extname(filename)
	const mimetype = mimetypes[extension].type
	readFile(filename, function(err, filecontent) {
		if (err) {
			exports.sendJSON(req, res, {"error": err.message}, 404)
			return
		}
		res.statusCode = 200
		res.setHeader("Content-type", mimetype)
		res.end(filecontent)
	})
}

exports.streamFile = function(req, res, filename) {
	const extension = extname(filename)
	const mimetype = mimetypes[extension].type
	const stream = createReadStream(filename)
	stream.on("error", function(err) {
		console.log(err)
		exports.sendJSON(req, res, {error: {msg: "Something went wrong"}}, 404)
		return
	})
	res.statusCode = 200
	res.setHeader("Content-type", mimetype)
	stream.pipe(res)
}

exports.redirect = function(res, url) {
    res.statusCode = 301;
    res.setHeader("Location", url);
    res.end();
}

exports.logger = function(req, res) {
    const startTime = hrtime.bigint();
    const logTime = new Date().toLocaleString();
    res.on("finish", function(){
        const duration = Number(hrtime.bigint() - startTime) / 1000000;

        let color;
        switch (true) {
            case res.statusCode >= 400:
                color = "red"
                break;
            case res.statusCode >= 300:
                color = "yellow"
                break;
            case res.statusCode >= 200:
                color = "green"
                break;
            case res.statusCode >= 100:
                color = "white"
                break;
        }
        //const color = res.statusCode >= 400 ? exports.textColor("red") : exports.textColor("green");
        const logMsg = `${textColor(color)}[${logTime}] [${res.statusCode}] ${req.method}: ${req.url} (${duration}ms)${textColor()}`
        console.log(logMsg);
    })
}

exports.getData = function(req) {
    return new Promise((resolve, reject) => {
        let dataStr = "";
        
        req.on("data", function (chunk) {
            dataStr += chunk;
        })
        req.on("end", function () {
            try {
                resolve(JSON.parse(dataStr));
            } catch (err) {
                reject(new Error('Something went wrong.'));
            }
            
        });
        
    });
}

exports.validateJsonSchema = function(json, schema) {
    if (Object.keys(json).length != schema.length) {
        return false;
    }

    for (const property in json) {
        if (!schema.includes(property)) {
            return false;
        }
    }

    return true;
}

textColor = function (color = 'reset') {
    const colors = {
        reset: "\x1b[0m",
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    }
    
    return colors[color];
}