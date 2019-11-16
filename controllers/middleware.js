const db = require('../models');

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		//isAuthenticated where ??
		next();
	} else {
		res.status(401).json({ code: 401, message: 'Please login first.' });
	}
};

const isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({ code: 401, message: 'You should logout first' });
	}
};

const isExistTodo = async (req, res, next) => {
	try {
		const todo = await db.Todo.findOne({
			where: { id: req.body.todoId, userId: req.user.id },
		});
		if (todo) {
			next();
		} else {
			return res.status(400).json({ code: 400, message: 'todo not found.' });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ code: 500, message: 'Server error while isExistTodo' });
	}
};

const isExistTimeline = async (req, res, next) => {
	try {
		const { todoId, timelineId } = req.body;
		const timeline = await db.Timeline.findOne({
			where: {
				id: timelineId,
				todoId,
			},
		});
		if (timeline) {
			next();
		} else {
			return res
				.status(400)
				.json({ code: 400, message: 'timeline not found.' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ code: 500, message: 'Server error.' });
	}
};

module.exports = { isLoggedIn, isNotLoggedIn, isExistTodo, isExistTimeline };
