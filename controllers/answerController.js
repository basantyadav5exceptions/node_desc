const Answer = require('../models/answerModel')


exports.createAnswerOfComment = async (req, res) => {
    try {
            // Extract required fields from request body
            const { comment_id, answer_desc, user_id } = req.body;

            // Validate request
            if (!comment_id || !answer_desc || !user_id) {
                return res.status(400).send({
                    message: "Please all fields required"
                });
            }

            // Create a Answer object
            const newAnswer = {
                comment_id: comment_id,
                answer_desc: answer_desc,
                user_id: user_id
            };
            
            // Save Topic in the database
            Answer.createAnswer(newAnswer, (err, answer) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while creating the comment."
                    });
                }

                return res.status(201).send({
                    message: "Answer given on comments",
                    status: "success",
                    data: answer
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


exports.getAnswerOfComment = (req, res) => {
    const CommentId = req.params.comment_id;
    Answer.getAnswerOfCommentByCommentId(CommentId, (err, answer) => {
        if (!answer && CommentId) {
            return res.status(200).json({ message: 'There are no answer on comment' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving comment' });
        }
        
        res.status(200).json(answer);
    });
};