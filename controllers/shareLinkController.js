const ShareLink  = require('../models/shareLinkModel');


exports.sendLinkOnEmail = async (req, res) => {
    try {
            // Extract required fields from request body
            const { sender_userId, reciever_userId, link } = req.body;

            // Validate request
            if (!sender_userId || !reciever_userId || !link) {
                return res.status(400).send({
                    message: "Please all fields required"
                });
            }

            // Send new link
            const newLink = {
                sender_userId: sender_userId,
                reciever_userId: reciever_userId,
                link: link
            };
            
            // Save Topic in the database
            ShareLink.sendLinkOnEmail(newLink, (err, link) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while sending the link."
                    });
                }

                return res.status(201).send({
                    message: "Send link on email",
                    status: "success",
                    data: link
                });
            });
        
    } catch (error) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            status: 'error',
            data: error,
        });
    }
};
