const sqlite3 = require("sqlite3").verbose();

exports.db = new sqlite3.Database('src\\datasource\\people.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('[sqlite3] Connection Failed');
        console.log(err);
        return;
    }

    console.log('[sqlite3] Connection Successful');
})