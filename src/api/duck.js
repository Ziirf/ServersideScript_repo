const { sendJSON } = require("../utilities");

module.exports = {
    "GET": {
        handler: function(req, res, param) {
            const json = {
                route: "/api/duck",
                method: req.method,
                says: "Quack",
                param: param
            }

            sendJSON(req, res, json);
        }
    }
}