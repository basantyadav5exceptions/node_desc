const Notification = require('../models/notificationModel')


exports.updateNotificationTopic = (req, res) => {
    const { noti_tpId, seenTopicBy_userId } = req.body;

    if (!noti_tpId || !seenTopicBy_userId) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Call the model function to update seenTopicBy_userId based on the given conditions
    Notification.updateSeenTopicByUserId({
        seenTopicBy_userId: seenTopicBy_userId,
        noti_tpId: noti_tpId,
    }, (err, updateResult) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating seenTopicBy_userId' });
        }
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'No matching records found for the given conditions' });
        }
            res.status(200).json({message: "Notification updated"});
       
    });
};

exports.getAllNotificationTopic = (req, res) => {
    const seenTopicBy_userId = req.query.seenTopicBy_userId;
    const tpPoster_userId = req.query.tpPoster_userId;
    // Fetch the updated notifications
    Notification.getNotificationByTopic(seenTopicBy_userId, tpPoster_userId, (fetchErr, notifications) => {
        if (fetchErr) {
            return res.status(500).json({ message: 'Error fetching updated notifications' });
        }
        
        // Check if there are no notifications
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'Not found any notifications' });
        }
        
        // If notifications are found, send them in the response
        res.status(200).json(notifications);
    });
};


 
