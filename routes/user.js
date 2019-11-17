const express = require('express');

const { verifyToken } = require('../controllers/middleware');
const { signUp, logIn, logOut, getUserInfo } = require('../controllers/user');

const router = express.Router();

// POST api/user/signup
router.post('/signup', signUp);

// POST api/user/login
router.post('/login', logIn);

// POST api/user/logout
router.post('/logout', verifyToken, logOut);

// GET api/user
router.get('/', verifyToken, getUserInfo);

module.exports = router;
