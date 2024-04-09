const sql = require("../config/dbConnection");

// constructor
const Comment = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Comment.createComment = (newComment, result) => {
    sql.query("INSERT INTO comments SET ?", newComment, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newComment });
    });
};


Comment.getCommentByTopicId = (tp_id, result) => {
    sql.query('SELECT * FROM comments WHERE tp_id = ?', tp_id, (err, res) => {
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

module.exports = Comment;