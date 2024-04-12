const Like  = require('../models/likeModel');


exports.likeUnlikeTopic = async (req, res) => {
    console.log(req)
    try {
           // Check user_id and tp_id is already exist or not
            Like.findUserIdAndTopicId(req.body.user_id , req.body.tp_id, async (err, data) => {
                if (err) {
                    if (err.kind === 'not_found') {
                        const newRecord = {
                            like_unlike: req.body.like_unlike,
                            user_id: req.body.user_id,
                            tp_id: req.body.tp_id
                           
                         };
                            
                        // Create new likes     
                        Like.addNewLike(newRecord, async (err1, newLike) => {
                            if (err1) {
                                return res.status(400).send({
                                    message: 'We are currently unable to onboard you. Please try again after some time.',
                                    status: 'error',
                                    data: err1,
                                });
                              } else {
                                return res.status(200).send({
                                    message: 'New record added.',
                                    status: 'success',
                                    data: newLike,
                                });
                            }
                        });
                    } else {
                        return res.status(400).send({
                            message: 'Something went wrong.',
                            status: 'error',
                            data: err,
                        });
                    }
                } else {
                  
                    const updateData = 
                     {   
                        like_unlike : req.body.like_unlike,
                        user_id:  req.body.user_id, 
                        tp_id : req.body.tp_id
                    }
            
                    // Update user record   
                    User.updateLike(data.id, updateData, async (err, updatedLike) => {
                        if (err) {
                            return res.status(400).send({
                                message: 'Error updating user information.',
                                status: 'error',
                                data: err,
                            });
                        }
                
                            return res.status(200).send({
                                message: 'Like updated',
                                status: 'success',
                                data: updatedLike
                            });
                        });
                    
                }
            });
       
       } catch (error) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            status: 'error',
            data: error,
        });
    }
};