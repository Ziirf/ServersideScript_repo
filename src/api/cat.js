const { sendJSON, getData, validateJsonSchema } = require("../utilities")
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
                .then( function (input) {
                    const schema = ["Cat", "Sound"];

                    if (!validateJsonSchema(input, schema)) {
                        sendJSON(req, res, { route: currentRoute, method: req.method, error: "Schema doesn't Match" }, 400);
                        return;
                    }

                    sendJSON(req, res, { route: currentRoute, method: req.method, says: "Miauw", body: input });
                }).catch( function (error) {
                    sendJSON(req, res, { route: currentRoute, method: req.method, error: error }, 400);
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