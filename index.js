const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 8085;

app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    name: 'domybest',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
