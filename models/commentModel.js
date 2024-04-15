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
    sql.query(`
        SELECT 
            c.id, 
            c.comment_desc, 
            c.user_id, 
            c.tp_id, 
            c.user_image, 
            c.user_name, 
            c.created_at, 
            c.updated_at, 
            r.id AS answer_id, 
            r.answer_desc, 
            r.user_id AS answer_user_id, 
            r.comment_id AS answer_comment_id 
        FROM 
            comments c 
        LEFT JOIN 
            reply_of_comment r 
        ON 
            c.id = r.comment_id 
        WHERE 
            c.tp_id = '${tp_id}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        
        // Transforming the data into the desired format
        const comments = {};
        
        res.forEach(row => {
            if (!comments[row.id]) {
                comments[row.id] = {
                    id: row.id,
                    comment_desc: row.comment_desc,
                    user_id: row.user_id,
                    tp_id: row.tp_id,
                    user_image: row.user_image,
                    user_name: row.user_name,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    "answer_data": []
                };
            }
            
            if (row.answer_id) {
                comments[row.id]["answer_data"].push({
                    id: row.answer_id,
                    answer_desc: row.answer_desc,
                    user_id: row.answer_user_id,
                    comment_id: row.answer_comment_id,
                    user_image: row.user_image,
                    user_name: row.user_name,
                });
            }
        });

        const resultArray = Object.values(comments);
        
        result(null, resultArray);
    });
};


module.exports = Comment;