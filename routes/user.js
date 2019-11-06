const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(403).json({ code: 403, message: 'Already exist.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      nick: nickname,
      password: passwordHash,
    });
    const jsonUser = newUser.toJSON();
    console.log('jsonUser: ', jsonUser, jsonUser.id);
    const result = { userId: jsonUser.id, nickname: jsonUser.nick };
    return res
      .status(200)
      .json({ code: 200, message: 'User create.', data: result });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

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

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({ code: 200, message: 'Logout success' });
});

module.exports = router;
