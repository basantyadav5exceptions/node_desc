const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");


router.get('/test', (req, res, next) => {
    return res.status(201).send({
        msg: 'Working!'
    });
})


const users_controller = require("../controllers/userController");
const topics_controller = require("../controllers/topicController");
const comments_controller = require("../controllers/commentController");
const likes_controller = require("../controllers/likeController");
const answers_controller = require("../controllers/answerController");

router.post("/login", users_controller.loginUser);
router.post('/logout', users_controller.logoutUser);
router.post('/register', users_controller.registerUser);
router.post('/create-topic', topics_controller.createTopic);
router.get('/search-topics/:category', topics_controller.getTopicByCategoryAndSearchTopicByTittle);
router.get('/get-topics-by-id/:id', topics_controller.getTopicById);
router.post('/create-comment', comments_controller.createComment);
router.get('/comments/:tp_id', comments_controller.getCommentByTopicId);
router.post('/like-unlike-topic', likes_controller.likeUnlikeTopic);
router.post('/answer-of-comment', answers_controller.createAnswerOfComment);
router.get('/get-answer-of-comment/:comment_id', answers_controller.getAnswerOfComment);


module.exports = router;