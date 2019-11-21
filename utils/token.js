const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const addToken = (userInfo) => {
  const result = {
    userId: userInfo.id,
    email: userInfo.email,
    nickname: userInfo.nickname,
  };
  result.token = jwt.sign(result, process.env.JWT_SECRET, {
    expiresIn: '2h',
    issuer: 'Doit!',
  });

  return result;
};

module.exports = { addToken };
