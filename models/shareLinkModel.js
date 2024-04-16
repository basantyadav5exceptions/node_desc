const sql = require("../config/dbConnection");

// constructor
const ShareLink = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

ShareLink.sendLinkOnEmail = (newRecord, result) => {
    sql.query("INSERT INTO share_link SET ?", newRecord, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res.newRecord);
    });
};

module.exports = ShareLink;