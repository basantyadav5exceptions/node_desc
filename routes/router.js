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

router.post("/login", users_controller.loginUser);
router.post('/register', users_controller.registerUser);
router.post('/create-topic', topics_controller.createTopic);
router.get('/topics/:category', topics_controller.getTopicByCategory);
router.get('/get-topics-by-id/:id', topics_controller.getTopicById);
router.post('/create-comment', comments_controller.createComment);
router.get('/comments/:tp_id', comments_controller.getCommentByTopicId);


module.exports = router;