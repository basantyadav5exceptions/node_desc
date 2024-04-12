const sql = require("../config/dbConnection");


// constructor
const Answer = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Answer.createAnswer = (newAnswer, result) => {
    sql.query("INSERT INTO answers SET ?", newAnswer, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newAnswer });
    });
};

Answer.getAnswerOfCommentByCommentId = (comment_id, result) => {
    sql.query('SELECT * FROM answers WHERE comment_id = ?', comment_id, (err, res) => {
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


module.exports = Answer;