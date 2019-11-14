const moment = require('moment');
const db = require('../models');

const getTodos = async (req, res) => {
  try {
    const date = moment(req.params.date);
    const todos = await db.Todo.findAll({
      where: [
        db.sequelize.where(
          db.sequelize.fn('date', db.sequelize.col('todo.createdAt')),
          '=',
          date.format('YYYYMMDD'),
        ),
        { userId: req.user.id },
      ],
      attributes: [
        'id',
        'todoContent',
        'doneContent',
        'duration',
        'isComplete',
      ],
      include: [
        { model: db.Timeline, attributes: ['id', 'startedAt', 'endedAt'] },
      ],
    });

    return res
      .status(200)
      .json({ code: 200, message: 'todos inquiry success.', data: todos });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, message: 'todos inquiry failed.' });
  }
};

module.exports = { getTodos };
