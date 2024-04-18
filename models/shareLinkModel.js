const sql = require("../config/dbConnection");

// constructor
const ShareLink = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

ShareLink.findTopicIdAndsenderUserId = (sender_userId, tp_id, result) => {
    sql.query(`SELECT * FROM share_topic WHERE sender_userId = '${sender_userId}' AND tp_id = '${tp_id}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        // not found User with the id
        result({ kind: "not_found" }, null);
    });
};


ShareLink.updateShareData = (id, data, result) => {
    sql.query("UPDATE share_topic SET ? WHERE id=?", [data, id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        sql.query("SELECT * FROM share_topic WHERE id = ?", id, (err, updatedRecord) => {
            if (err) {
                result(err, null);
                return;
            }
            
            result(null, ...updatedRecord);
        });
    });
    
};

ShareLink.createShareTopic = (link, result) => {
    sql.query("INSERT INTO share_topic SET ?", link, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res.link);
    });
};

module.exports = ShareLink;