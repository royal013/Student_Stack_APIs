const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
dotenv.config();
const registrationController = require('../controllers/registrationController');
const postController = require('../controllers/postContoller');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.userId;
        next();
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });



router.post('/userRegister', registrationController.register);
router.post('/login', registrationController.login);
router.get('/profile', verifyToken, registrationController.getUserProfile);


router.post('/post', verifyToken, upload.single('photo'), postController.newPost);
router.get('/getAllPost', verifyToken, postController.getAllPost);

module.exports = router;