const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    dialect: process.env.DEV_DIALECT,
  },
  production: {
    username: process.env.PRD_USERNAME,
    password: process.env.PRD_PASSWORD,
    database: process.env.PRD_DATABASE,
    host: process.env.PRD_HOST,
    dialect: process.env.PRD_DIALECT,
    logging: false,
  },
  test: {
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    dialect: process.env.TEST_DIALECT,
  },
};
