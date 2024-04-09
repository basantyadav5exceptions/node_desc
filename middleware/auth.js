const jwt = require("jsonwebtoken");
const secRetKey = 'secrect_key';

function verifyToken(req, res, next) {
    const reqHeader = req.headers['authorization'];
    if (typeof reqHeader !== 'undefined') {
        const bearrer = reqHeader.split(" ");
        const token = bearrer[1];
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
};

module.exports = verifyToken;