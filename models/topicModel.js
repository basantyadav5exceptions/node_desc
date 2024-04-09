const sql = require("../config/dbConnection");


// constructor
const Topic = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Topic.createTopic = (newTopic, result) => {
    sql.query("INSERT INTO topics SET ?", newTopic, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newTopic });
    });
};

Topic.getTopicByCategory = (category, result) => {
    sql.query('SELECT * FROM topics WHERE category = ?', category, (err, res) => {
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
Topic.getTopicById = (topicId, result) => {
    sql.query('SELECT * FROM topics WHERE id = ?', topicId, (err, res) => {
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



module.exports = Topic;