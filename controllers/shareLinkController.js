const ShareLink  = require('../models/shareLinkModel');
const nodemailer = require('nodemailer');
const path = require('path');


exports.shareTopicAndSendEmail = async (req, res) => {
    try {
        // Check if receiver_userEmail is provided
        if (!req.body.receiver_userEmail || req.body.receiver_userEmail.length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one recipient email address.',
                status: 'error'
            });
        }

        // Share the topic
        ShareLink.findTopicIdAndsenderUserId(req.body.sender_userId, req.body.tp_id, async (err, data) => {
            if (err) {
                // If topic not found, create a new share link
                if (err.kind === 'not_found') {
                    const newRecord = {
                        sender_userId: req.body.sender_userId,
                        receiver_userEmail: JSON.stringify(req.body.receiver_userEmail),
                        tp_link: req.body.tp_link,
                        tp_id: req.body.tp_id
                    };

                    // Save share link in the database
                    ShareLink.createShareTopic(newRecord, async (err, link) => {
                        if (err) {
                            return res.status(500).json({
                                message: err.message || "Some error occurred while sharing the topic."
                            });
                        }

                        // Send email with topic link
                        try {
                            await sendTopicEmail(req.body.receiver_userEmail, req.body.tp_link);
                            return res.status(201).json({
                                message: "Topic shared successfully on your email.",
                                status: "success",
                                data: link
                            });
                        } catch (error) {
                            return res.status(500).json({
                                message: "Error sending email.",
                                status: "error",
                                error: error.message
                            });
                        }
                    });
                } else {
                    return res.status(400).json({
                        message: 'Something went wrong.',
                        status: 'error',
                        data: err
                    });
                }
            } else {
                // If topic found, update the share link
                const updateData = {
                    receiver_userEmail: JSON.stringify(req.body.receiver_userEmail),
                    tp_link: req.body.tp_link
                };

                // Update share link data
                ShareLink.updateShareData(data.id, updateData, async (err, updatedLike) => {
                    if (err) {
                        return res.status(400).json({
                            message: 'Error updating share link information.',
                            status: 'error',
                            data: err
                        });
                    }

                    // Send email with topic link
                    try {
                        await sendTopicEmail(req.body.receiver_userEmail, req.body.tp_link);
                        return res.status(200).json({
                            message: 'Topic shared successfully on your email.',
                            status: 'success',
                            data: updatedLike                    
                        });
                    } catch (error) {
                        return res.status(500).json({
                            message: "Error sending email.",
                            status: "error",
                            error: error.message
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong, please try again.',
            status: 'error',
            data: error
        });
    }
};

async function sendTopicEmail(receiver_userEmail, tp_link) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "basant5exceptions@gmail.com",
            pass: "gcec xnqx mumk clay"
        }
    });

    const mailOptions = {
        from: {
            name: "Basant 5exceptions",
            address: "basant5exceptions@gmail.com"
        },
        to: JSON.stringify(receiver_userEmail), // Convert array to string
        subject: 'Share topic',
        html: `<div 
                  style="    
                     background-color: rgb(235 235 235);
                     padding: 20px;
                     border-radius: 10px;
                     width: 80%;
                     margin: 0px auto;
                     font-family: Arial, 
                     sans-serif;"
                     >
                  <h5>Please click on this link</h5>
                  <p>
                    link: <a href="${tp_link}" 
                    style="color: #007bff;
                    text-decoration: none;"
                    >${tp_link}</a>
                 </p> 
             </div>`
    };

    await transporter.sendMail(mailOptions);
}

