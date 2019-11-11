const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();
// POST api/user/signup
router.post('/signup', async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await db.User.findOne({ where: { email } });
    if (exUser) {
      return res.status(403).json({ code: 403, message: 'Already exist.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.User.create({
      email,
      nick: nickname,
      password: passwordHash,
    });
    return res.status(200).json({ code: 200, message: 'User create.' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// POST api/user/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      console(error);
      return next(error);
    }
    if (info) {
      return res.status(401).json({ code: 401, message: info.reason });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      const result = {
        userId: req.user.id,
        email: req.user.email,
        nickname: req.user.nick,
      };
      return res
        .status(200)
        .json({ code: 200, message: 'Login success', data: result });
    });
  })(req, res, next);
});

// POST api/user/logout
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({ code: 200, message: 'Logout success' });
});

// GET api/user
router.get('/', isLoggedIn, async (req, res) => {
  res.status(200).json({
    code: 200,
    message: 'User Info Inquiry success.',
    data: req.user,
  });
});

module.exports = router;
