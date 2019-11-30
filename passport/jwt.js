const passport = require('passport');
const passportJWT = require('passport-jwt');
const dotenv = require('dotenv');

const { User } = require('../models');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

dotenv.config();

module.exports = () => {
  // console.log('JWT START');
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findOne({
            where: { id: jwtPayload.userId },
            attributes: ['id', 'email', 'nickname'],
          });
          if (!user) {
            return done(null, false, { reason: 'User Info does not exist.' });
          }
          return done(null, user);
        } catch (e) {
          console.error(e);
          return done(e);
        }
      },
    ),
  );
};
