const Topic = require('../models/topicModel'); // Import the Topic model
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

                return res.status(201).send({
                    message: "Topic created successfully",
                    status: "success",
                    data: topic
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




exports.getTopicByCategory = (req, res) => {
    const category = req.params.category;
    Topic.getTopicByCategory(category, (err, topic) => {
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving topic' });
        }
       
        // const modifiedTopics = topic.map(topic => {
        //     return {
        //         ...topic,
        //         image: path.join(__dirname, topic.image).replace('controllers\\', '').replace(/\\/g, '/'),
        //         video: path.join(__dirname, topic.video).replace('controllers\\', '').replace(/\\/g, '/')
        //     };
        // });

        // Send only the modified image URLs
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
