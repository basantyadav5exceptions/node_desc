

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'files/images');
    },
    filename: (req, file, callback) => {
        const originalname = file.originalname;
        const filePath = path.join('files/images', originalname);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, originalname);
                });
            } else {
                callback(null, originalname);
            }
        });
    }
});

const upload = multer({ storage: storage }).single('image');

exports.registerUser = async (req, res) => {
    upload(req, res, async (uploadFileErr) => {
        if (uploadFileErr) {
            return res.status(400).send({
                message: 'Error uploading image',
                status: 'error',
                data: uploadFileErr,
            });
        }

        User.findByEmail(req.body.email, async (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    const { name, email, password } = req.body;

                    // Validate request
                    if (!email || !password || !name) {
                        return res.status(400).send({
                            message: "Name, email, and password are required"
                        });
                    }

                    // Hash password
                    const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

                    // Create a User object
                    const newUser = {
                        name: name,
                        email: email,
                        password: hashedPassword,
                        // Assuming you want to save the image path in the database
                        image: req.file ? req.file.path : null
                    };

                    // Save User in the database
                    User.createUser(newUser, (err, user) => {
                        if (err) {
                            return res.status(500).send({
                                message: err.message || "Some error occurred while creating the User."
                            });
                        }

                        const token = jwt.sign({ id: user.id }, 'basantyadav5exceptions', {expiresIn: '1d'});

                        return res.status(201).send({
                            message: "User registered successfully",
                            data: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                image: `http://localhost:3000/files/images/${user.image.replace(/^.*[\\\/]/, '')}`
                            },
                            token: token
                        });
                    });
                } else {
                    return res.status(400).send({
                        message: 'Something went wrong.',
                        status: 'error',
                        data: err,
                    });
                }
            } else {
                return res.status(400).send({
                    message: 'The email has already taken.',
                    // status: 'error',
                    // data: null
                });
            }
        });
    });
};



exports.loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Validate request
    if (!email || !password) {
        return res.status(400).send({
            message: "Email and password are required"
        });
    }

    User.findByEmail(email, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `User not found with email ${email}`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving user with email " + email
                });
            }
        } else {
            // Check if password matches
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).send({
                    message: "Invalid Password"
                });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id }, 'basantyadav5exceptions', {
                expiresIn: '1d' // 24 hours
            });

            // Include token in response
            return res.status(200).send({
                message: "Login successfully",
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: `http://localhost:3000/files/images/${user.image.replace(/^.*[\\\/]/, '')}`
                },
                token: token
            });
            
        }
    });
};

exports.getUserList = (req, res)=>{
    const userId = req.query.id;
    User.getUserListData(userId, (err, userName) => {
        if (!userName ) {
            return res.status(400).json({ message: 'There are no user' });
        }
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        res.status(200).json(userName);
    });
}

exports.logoutUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    res.clearCookie(token);
    res.json({ message: 'Logout successfully' });
};