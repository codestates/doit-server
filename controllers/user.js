const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const db = require('../models');

const signUp = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  // 각각에 대한 validation. 특히 email.
  try {
    const exUser = await db.User.findOne({ where: { email } });
    if (exUser) {
      return res
        .status(403)
        .json({ code: 403, message: 'This email is already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.User.create({
      email,
      nickname,
      password: passwordHash,
    });
    res
      .status(200)
      .json({ code: 200, message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    next(error); // 이렇게 넘기면 어디로?
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
      const token = jwt.sign(
        {
          userId: req.user.id,
          email: req.user.email,
          nickname: req.user.nickname,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '2h',
          issuer: 'Doit!',
        },
      );
      return res.status(200).json({
        code: 200,
        message: 'Login success',
        data: token,
      });
    });
  })(req, res, next);
};

const logOut = (req, res) => {
  req.logout();
  req.session.destroy();
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
