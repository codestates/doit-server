const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('../controllers/middleware');
const { signUp, logIn, logOut, getUserInfo } = require('../controllers/user');

const router = express.Router();

// POST api/user/signup
router.post('/signup', isNotLoggedIn, signUp);

// POST api/user/login
router.post('/login', isNotLoggedIn, logIn);

// POST api/user/logout
router.post('/logout', isLoggedIn, logOut);

// GET api/user
router.get('/', isLoggedIn, getUserInfo);

module.exports = router;
