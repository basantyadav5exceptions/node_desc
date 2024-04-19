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
const reply_controller = require("../controllers/replyController");
const shareTopic_controller = require("../controllers/shareLinkController");

router.post("/login", users_controller.loginUser);
router.post('/logout',auth, users_controller.logoutUser);
router.post('/register', users_controller.registerUser);
router.patch('/update-profile/:id', users_controller.updateProfile);
router.post('/create-topic', topics_controller.createTopic);
router.get('/search-topics/:category',auth, topics_controller.getTopicByCategoryAndSearchTopicByTittle);
router.get('/get-topics-by-id/:id',auth, topics_controller.getTopicById);
router.post('/create-comment', comments_controller.createComment);
router.get('/comments/:tp_id', comments_controller.getCommentByTopicId);
router.post('/like-unlike-topic', likes_controller.likeUnlikeTopic);
router.post('/reply-of-comment', reply_controller.createReplyOfComment);
// router.get('/get-reply-of-comment/:comment_id', reply_controller.getReplyOfComment);
router.get('/get-like-on-topic/:tp_id', likes_controller.getLikeUnlike);
router.get('/get-user-name', users_controller.getUserList);
// router.post('/share-topic', shareTopic_controller.shareTopic);
router.post('/send-topic-on-email', shareTopic_controller.shareTopicAndSendEmail);


module.exports = router;