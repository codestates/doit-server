const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DEV_USERNAME1,
    password: process.env.DEV_PASSWORD1,
    database: process.env.DEV_DATABASE1,
    host: process.env.DEV_HOST1,
    dialect: process.env.DEV_DIALECT1,
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
