const sql = require("../config/dbConnection");

// constructor
const Users = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Users.findByEmail = (email, result) => {
    sql.query("SELECT * FROM users WHERE email = ?", email, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res[0]);
            return;
        }

        // User with the email not found
        result({ kind: "not_found" }, null);
    });
};


Users.createUser = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newUser });
    });
};

Users.getUserListData = (userId, result) => {
    sql.query(`SELECT name, email FROM users where not id = '${userId}'`, (err, res) => {
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




module.exports = Users;