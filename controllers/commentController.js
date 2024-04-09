const Comment  = require('../models/commentModel');


exports.createComment = async (req, res) => {
    try {
            // Extract required fields from request body
            const { comment_desc, tp_id, user_id, user_image, user_name } = req.body;

            // Validate request
            if (!comment_desc || !tp_id || !user_id) {
                return res.status(400).send({
                    message: "Please write comment"
                });
            }

            // Create a Comments object
            const newComment = {
                comment_desc: comment_desc,
                user_id: user_id,
                tp_id: tp_id,
                user_image: user_image,
                user_name: user_name
            };
            
            // Save Topic in the database
            Comment.createComment(newComment, (err, comment) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while creating the comment."
                    });
                }

                return res.status(201).send({
                    message: "Comment created successfully",
                    status: "success",
                    data: comment
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



exports.getCommentByTopicId = (req, res) => {
    const topicId = req.params.tp_id;
    Comment.getCommentByTopicId(topicId, (err, comment) => {
        if (!comment && topicId) {
            return res.status(200).json({ message: 'There are no comments on topic' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving comment' });
        }
        
        res.status(200).json(comment);
    });
};



