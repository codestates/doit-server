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

app.use(morgan('dev'));

// var whitelist = [
// 	'http://mygraphr.com',
// 	'https://youdoit.space',
// 	'http://localhost:3000',
// ];
// var corsOptionsDelegate = function(req, callback) {
// 	var corsOptions;
// 	if (whitelist.indexOf(req.header('Origin')) !== -1) {
// 		corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
// 	} else {
// 		corsOptions = { origin: false }; // disable CORS for this request
// 	}
// 	callback(null, corsOptions); // callback expects two parameters: error and options
// };

app.use(
	cors(
		// corsOptionsDelegate,
		{
			// origin: true,
			origin: 'http://mygraphr.com:3000',
			credentials: true,
		},
	),
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
