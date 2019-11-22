const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const { addToken } = require('../utils/token');

const signUp = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await db.User.findOne({ where: { email } });
    if (exUser) {
      return res.status(403).json({
        code: 403,
        message: '이미 등록된 이메일입니다.',
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      email,
      nickname,
      password: passwordHash,
    });
    const result = addToken(newUser);

    res.status(200).json({
      code: 200,
      message: 'User registered successfully.',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '회원 가입 실패.' });
  }
};

const logIn = (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      console.error(error);
      return res.status(400).json({
        code: 400,
        message: 'Login error.',
      });
    }
    if (info) {
      console.log(info.reason);
      return res.status(401).json({ code: 401, message: info.reason });
    }
    req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      const result = addToken(req.user);

      return res.status(200).json({
        code: 200,
        message: 'Login success',
        data: result,
      });
    });
  })(req, res, next);
};

const logOut = (req, res) => {
  res.status(200).json({ code: 200, message: 'Logout success' });
};

const getUserInfo = async (req, res) => {
  res.status(200).json({
    code: 200,
    message: 'User Info Inquiry success.',
    data: req.user,
  });
};

module.exports = { signUp, logIn, logOut, getUserInfo };
