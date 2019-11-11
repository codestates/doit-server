const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  devLocal: {
    username: process.env.DEVLOCAL_USERNAME,
    password: process.env.DEVLOCAL_PASSWORD,
    database: process.env.DEVLOCAL_DATABASE,
    host: process.env.DEVLOCAL_HOST,
    dialect: process.env.DEVLOCAL_DIALECT,
    options: {
      timezone: '+09:00',
    },
  },
  devAWS: {
    username: process.env.DEVAWS_USERNAME,
    password: process.env.DEVAWS_PASSWORD,
    database: process.env.DEVAWS_DATABASE,
    host: process.env.DEVAWS_HOST,
    dialect: process.env.DEVAWS_DIALECT,
    options: {
      timezone: '+09:00',
    },
  },
  test: {
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    dialect: process.env.TEST_DIALECT,
    options: {
      timezone: '+09:00',
    },
  },
};
