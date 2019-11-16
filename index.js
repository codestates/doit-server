const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');
const todosRouter = require('./routes/todos');

dotenv.config();

const app = express();
const port = process.env.PORT || 8085;
db.sequelize.sync();
passportConfig();

const env = process.env.NODE_ENV === 'production';

app.use(morgan('dev'));

app.use(
	cors({
		origin: env ? 'http://doitreviews.com:3000' : true, // 전부 다 허용도 ok?
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

app.use('/api/user', userRouter);
app.use('/api/todo', todoRouter);
app.use('/api/todos', todosRouter);

app.use('/health', (req, res) => {
	res.status(200).send('hello world');
});

app.listen(port, () => {
	console.log(`listening to http://localhost:${port}`);
});

module.exports = app;
