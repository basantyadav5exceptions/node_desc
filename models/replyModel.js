const sql = require("../config/dbConnection");


// constructor
const ReplyOfComment = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


ReplyOfComment.createReply = (newAnswer, result) => {
    sql.query("INSERT INTO reply_of_comment SET ?", newAnswer, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newAnswer });
    });
};

ReplyOfComment.getReplyOfCommentByCommentId = (comment_id, result) => {
    sql.query('SELECT * FROM reply_of_comment WHERE comment_id = ?', comment_id, (err, res) => {
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


module.exports = ReplyOfComment;