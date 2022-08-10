const { sendJSON } = require("../utilities")

module.exports = {
    "GET": {
        handler: function(req, res, param) {
            const json = {
                route: "/api/cat",
                method: req.method,
                says: "Miauw",
                param: param
            }

            sendJSON(req, res, json);
        }
    }
}