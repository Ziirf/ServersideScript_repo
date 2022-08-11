const { sendJSON, getData, validateJsonSchema, log } = require("../utilities");
const { db } = require("../datasource/sqlite.js");
const currentRoute = "/api/student";

module.exports = {
    "GET": {
        handler: function (req, res, param) {            

            if (param) {
                const query = `SELECT * FROM Students WHERE ID = ?`;
                db.get(query, param, function (err, row) {
                    if (err) {
                        sendJSON(req, res, { error: "An error occured" }, 400);
                        return;
                    }
                    if (!row) {
                        sendJSON(req, res, { error: "Nothing found" }, 404);
                        return;
                    }

                    sendJSON(req, res, row);
                    return;
                });
            }
            else {
                const query = `SELECT * FROM Students`;
                db.all(query, [], function (err, rows) {
                    if (err) {
                        sendJSON(req, res, { error: "An error occured" }, 400);
                        return;
                    }
                    
                    sendJSON(req, res, rows);
                    return;
                });
            }
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
                const schema = ["firstname", "lastname", "age", "email"];

                if (!validateJsonSchema(input, schema)) {
                    sendJSON(req, res, { route: currentRoute, method: req.method, error: "Schema doesn't Match" }, 405);
                    return;
                }

                const query = `INSERT INTO Students(firstname, lastname, age, email) VALUES (?,?,?,?)`
                db.run(query, [input.firstname, input.lastname, input.age, input.email], function (err) {
                    if (err) {
                        sendJSON(req, res, { error: "An error occured" }, 400);
                        return;
                    }
                    
                    sendJSON(req, res, Object.assign({Id: this.lastID}, input));
                });
            }).catch( function (err) {
                sendJSON(req, res, { route: currentRoute, method: req.method, error: "An error occured" }, 400);
                return;
            });
        }
    },
    "PUT": {
        handler: function (req, res, param) {
            if (!param) {
                sendJSON(req, res, {route: currentRoute, method: req.method, error: "Parameter required"}, 405)
                return;
            };

            getData(req)
            .then( function (input) {
                const schema = ["firstname", "lastname", "age", "email"];

                if (!validateJsonSchema(input, schema)) {
                    sendJSON(req, res, { route: currentRoute, method: req.method, error: "Schema doesn't Match" }, 405);
                    return;
                }

                const query = `UPDATE Students SET firstname = ?, lastname = ?, age = ?, email = ? WHERE ID = ?`
                db.run(query, [input.firstname, input.lastname, input.age, input.email, param], function (err) {
                    if (err) {
                        sendJSON(req, res, "An error occured", 400);
                        return;
                    };
                    
                    sendJSON(req, res);
                });
                
            }).catch( function (error) {
                sendJSON(req, res, { route: currentRoute, method: req.method, error: error }, 400);
            });
        }
    },
    "DELETE": {
        handler: function (req, res, param) {
            if (!param) {
                sendJSON(req, res, { route: currentRoute, method: req.method, error: "Parameter required" }, 405);
                return;
            };
            
            const query = `DELETE FROM Students WHERE ID = ?`;
            db.run(query, param, function (err) {
                if (err) {
                    sendJSON(req, res, { error: "An error occured" }, 400);
                    return;
                };

                sendJSON(req, res);
            });
        }
    }
}