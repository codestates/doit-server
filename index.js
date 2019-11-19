const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8085;
db.sequelize.sync();
passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: true, // front domain 적용 후 production 분기 처리
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());

app.use('/api', routes);

app.use('/health', (req, res) => {
  res.status(200).send('hello world');
});

app.listen(port, () => {
  console.log(`listening to ${port} port`);
});

module.exports = app;
