const Topic = require('../models/topicModel'); // Import the Topic model
const Notification = require('../models/notificationModel'); // Import the Topic model
const Users = require('../models/userModel');
const sql = require("../config/dbConnection");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'image') {
            callback(null, 'files/images');
        } else if (file.fieldname === 'video') {
            callback(null, 'files/videos');
        } else {
            callback({ message: 'Invalid file field' }, null);
        }
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Controller function
exports.createTopic = async (req, res) => {
    try {

        upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }])(req, res, async (uploadErr) => {
            if (uploadErr) {
                return res.status(400).send({
                    message: 'Error uploading files',
                    status: 'error',
                    data: uploadErr,
                });
            }

            // Extract required fields from request body
            const { tittle, description, user_id, category } = req.body;

            // Validate request
            if (!tittle || !description || !user_id) {
                return res.status(400).send({
                    message: "Title, desc, and userId are required"
                });
            }

            // Create a Topic object
            const newTopic = {
                tittle: tittle,
                user_id: user_id,
                description: description,
                image: req.files['image'] ? req.files['image'][0].path : null,
                video: req.files['video'] ? req.files['video'][0].path : null,
                category: category
            };

            // Save Topic in the database
            Topic.createTopic(newTopic, (err, topic) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while creating the Topic."
                    });
                }
                // Create a notification for the newly created topic
                const newNotification = {
                    tpPoster_userId: topic.user_id,
                    noti_tpId: topic.id
                };

                // Insert into notifications table
                Notification.createNotification(newNotification, async (err, notification) => {
                    if (err) {
                        // Handle error while creating notification
                        return res.status(500).send({
                            message: err.message || "Some error occurred while creating the notification."
                        });
                    }

                    // Construct the topic link
                    const tp_link = `http://localhost:4200/descriptions-details/${topic.id}`;

                    const userId = topic.user_id;

                    Users.getUserListData(userId, async (err, emails) => {
                        if (!emails || emails.length === 0) {
                            return res.status(400).json({ message: 'There are no users' });
                        }
                        if (err) {
                            return res.status(500).json({ message: 'Error retrieving users' });
                        }

                        // Extract email addresses from the array of objects
                        const emailAddresses = emails.map(emailObj => emailObj.email);

                        try {
                            // Send email with topic link
                            await sendTopicEmail(emailAddresses, tp_link); 
                        } catch (error) {
                            console.error("Error sending email:", error);
                        }

                        return res.status(201).send({
                            message: "Topic created successfully",
                            status: "success",
                            data: topic
                        });
                    });
                });


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

async function sendTopicEmail(emails, tp_link) {
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
        to: JSON.stringify(emails), // Convert array to string
        subject: 'New Topic Added',
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




exports.getTopicByCategoryAndSearchTopicByTittle = (req, res) => {
    const payload = {
        category: req.params.category,
        tittle: req.query.tittle
    }
    Topic.getTopicByCategoryAndSearchTopicByTittle(payload, (err, topic) => {
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving topic' });
        }

        res.status(200).json(topic);
    });
};


exports.getTopicById = (req, res) => {
    const topicId = req.params.id;
    Topic.getTopicById(topicId, (err, topic) => {
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving topic' });
        }

        // Modify the image and video URLs
        topic.image = `http://localhost:3000/${topic[0].image.replace(/\\/g, '/')}`;
        topic.video = `http://localhost:3000/${topic[0].video.replace(/\\/g, '/')}`;

        res.status(200).json(topic);
    });
};


