const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT;
db.sequelize.sync();
passportConfig();

const env = process.env.NODE_ENV === 'production';

env ? app.use(morgan('combined')) : app.use(morgan('dev'));

app.use(
	cors({
		origin: env ? 'http://doitreviews.com:3000' : true,
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
			sameSite: false,
			domain: env ? '.doitreviews.com' : '',
		},
	}),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.use('/health', (req, res) => {
	res.status(200).send('hello world');
});

app.listen(port, () => {
	console.log(`listening to ${port} port`);
});

module.exports = app;
