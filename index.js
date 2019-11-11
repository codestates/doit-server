const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const https = require('https');

const passportConfig = require('./passport');
const db = require('./models');
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');
const todosRouter = require('./routes/todos');

dotenv.config();

const app = express();
const port = process.env.PORT || 443;
db.sequelize.sync();
passportConfig();

const lex = require('greenlock-express').create({
  version: 'draft-11', // 버전2
  configDir: '/etc/letsencrypt', // 또는 ~/letsencrypt/etc
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  approveDomains: (opts, certs, cb) => {
    if (certs) {
      opts.domains = ['api.mygraphr.com'];
    } else {
      opts.email = 'bfsudong@gmail.com';
      opts.agreeTos = true;
    }
    cb(null, { options: opts, certs });
  },
  renewWithin: 81 * 24 * 60 * 60 * 1000,
  renewBy: 80 * 24 * 60 * 60 * 1000,
});

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
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRouter);
app.use('/api/todo', todoRouter);
app.use('/api/todos', todosRouter);

https
  .createServer(lex.httpsOptions, lex.middleware(app))
  .listen(process.env.SSL_PORT || 443);

// app.listen(port, () => {
//   console.log(`listening to http://localhost:${port}`);
// });

module.exports = app;
