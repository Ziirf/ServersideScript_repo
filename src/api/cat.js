const { sendJSON, getData } = require("../utilities")
const currentRoute = "/api/cat";

module.exports = {
    "GET": {
        handler: function (req, res, param) {
            let json = {}

            if (param) {
                json = {
                    route: currentRoute,
                    method: req.method,
                    says: "Miauw",
                    param: param
                }
            }
            else {
                json = [{
                    route: currentRoute,
                    method: req.method,
                    says: "Miauw1",
                    param: param
                },
                {
                    route: currentRoute,
                    method: req.method,
                    says: "Miauw2",
                    param: param
                }]
            }

            sendJSON(req, res, json);
        }
    },
    "POST": {
        handler: function (req, res, param) {
            if (param) {
                sendJSON(req, res, {route: currentRoute, method: req.method, error: "Parameter not allowed"}, 405)
                return;
            };

            getData(req)
                .then((input) => {
                    sendJSON(req, res, { route: currentRoute, method: req.method, says: "Miauw", body: input })
                });
        }
    },
    "PUT": {
        handler: function (req, res, param) {
            if (!param) {
                sendJSON(req, res, {route: currentRoute, method: req.method, error: "Parameter required"}, 405)
                return;
            };
            
            const json = {
                route: currentRoute,
                method: req.method,
                says: "Miauw",
                param: param
            }

            sendJSON(req, res, json);
        }
    },
    "DELETE": {
        handler: function (req, res, param) {
            if (!param) {
                sendJSON(req, res, {route: currentRoute, method: req.method, error: "Parameter required"}, 405)
                return;
            };
            
            const json = {
                route: currentRoute,
                method: req.method,
                says: "Miauw",
                param: param
            }

            sendJSON(req, res, json);
        }
    }
}