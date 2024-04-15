const sql = require("../config/dbConnection");

// constructor
const Like = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

Like.findUserIdAndTopicId = (user_id, tp_id, result) => {
    sql.query(`SELECT * FROM likes WHERE user_id = '${user_id}' AND tp_id = '${tp_id}'`, (err, res) => {
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


Like.addNewLike = (newRecord, result) => {
    sql.query("INSERT INTO likes SET ?", newRecord, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res.newRecord);
    });
};

Like.updateLike = (id, data, result) => {
    sql.query("UPDATE likes SET ? WHERE id=?", [data, id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        sql.query("SELECT * FROM likes WHERE id = ?", id, (err, updatedRecord) => {
            if (err) {
                result(err, null);
                return;
            }
            
            result(null, ...updatedRecord);
        });
    });
    
};

Like.getLikeUnlikeByTopicId = (tp_id, result) => {
    sql.query(`SELECT * FROM likes WHERE tp_id = '${tp_id}' AND like_unlike = 1`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};




module.exports = Like;