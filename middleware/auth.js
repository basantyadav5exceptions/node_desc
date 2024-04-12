const jwt = require("jsonwebtoken");
const secRetKey = 'basantyadav5exceptions';

const  auth = (req, res, next) =>{
    const reqHeader = req.headers['authorization'];
   
    if (typeof reqHeader !== 'undefined') {
        const bearer = reqHeader.split(" ");
        const token = bearer[1];
        jwt.verify(token, secRetKey, (err, authData) => {
            if (err) {
                res.status(401).send({
                    msg: 'Token is not valid!',
                    status: 'error',
                    data: {}
                });
                return;
            } else {
                next();
            }
        })
    } else {
        return res.status(401).send({
            msg: 'Token is not valid!',
            status: 'error',
            data:{}
        });
    }
}

module.exports = auth;
