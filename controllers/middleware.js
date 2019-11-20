const db = require('../models');
const passport = require('passport');

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
    res.status(500).json({
      code: 500,
      message: 'Server error while checking whether todo exists',
    });
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

const verifyToken = passport.authenticate('jwt', { session: false });

module.exports = {
  isExistTodo,
  isExistTimeline,
  verifyToken,
};
