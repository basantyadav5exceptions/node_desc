
const sql = require("../config/dbConnection");

// constructor
const Notification = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Notification.createNotification = (newNotification, result) => {
    sql.query("INSERT INTO notifications SET ?", newNotification, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { id: res.insertId, ...newNotification });
    });
};

Notification.getNotificationTopicForUserId = (result) => {
    sql.query('SELECT notifications.id, notifications.tpPoster_userId, notifications.noti_tpId, topics.tittle, notifications.seenTopicBy_userId FROM notifications LEFT JOIN topics ON notifications.noti_tpId = topics.id', (err, res) => {
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

Notification.updateSeenTopicByUserId = ({ seenTopicBy_userId, noti_tpId}, result) => {
    // Check if the user ID already exists in the array
    sql.query(
        'SELECT seenTopicBy_userId FROM notifications WHERE noti_tpId = ?',
        [noti_tpId],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }

            // Parse the JSON array from the result
            const existingUserIds = res.length > 0 ? JSON.parse(res[0].seenTopicBy_userId) : [];

            // Check if the user ID already exists in the array
            if (existingUserIds.includes(seenTopicBy_userId)) {
                // If the user ID exists, do not update the array
                result(null, { message: 'User ID already exists in the array' });
            } else {
                // If the user ID does not exist, append it to the array
                sql.query(
                    'UPDATE notifications SET seenTopicBy_userId = JSON_ARRAY_APPEND(seenTopicBy_userId, "$", ?) WHERE noti_tpId = ?',
                    [seenTopicBy_userId, noti_tpId],
                    (updateErr, updateRes) => {
                        if (updateErr) {
                            result(updateErr, null);
                            return;
                        }
                        result(null, updateRes);
                    }
                );
            }
        }
    );
};

Notification.getNotificationByTopic = (seenTopicBy_userId, tpPoster_userId, result) => {
    // Fetch notifications excluding the provided seenTopicBy_userId and join with topics
    sql.query(
        `SELECT noti.*, top.tittle, top.image, top.category
         FROM notifications noti 
         JOIN topics top ON noti.noti_tpId = top.id
         WHERE not noti.tpPoster_userId = ${tpPoster_userId} AND JSON_CONTAINS(noti.seenTopicBy_userId, ?) = 0`,
        [seenTopicBy_userId],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        }
    );
};


module.exports = Notification;
