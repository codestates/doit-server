const passport = require('passport');
const { User } = require('../models');
const local = require('./local');
const jwt = require('./jwt');

module.exports = () => {
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ['id', 'nickname', 'email'],
      });
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  local();
  jwt();
};
