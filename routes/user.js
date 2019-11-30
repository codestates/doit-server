const express = require('express');

const { verifyToken } = require('../controllers/middleware');
const {
  signUp,
  logIn,
  logOut,
  getUserInfo,
  googleAuth,
} = require('../controllers/user');

const router = express.Router();

// POST api/user/signup
router.post('/signup', signUp);

// POST api/user/login
router.post('/login', logIn);

// POST api/user/logout
router.post('/logout', verifyToken, logOut);

// GET api/user
router.get('/', verifyToken, getUserInfo);

// POST api/user/auth/google
router.post('/auth/google', googleAuth);

module.exports = router;
