const http = require("http");
const conf = require("./config/serverconf.json");
const controller = require("./controller.js");
const server = http.createServer(controller);

server.listen(conf.port);