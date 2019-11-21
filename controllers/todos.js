const moment = require('moment');
const db = require('../models');

const getTodos = async (req, res) => {
  try {
    const date = moment(req.params.date);
    const todos = await db.Todo.findAll({
      where: [
        db.sequelize.where(
          db.sequelize.fn(
            'date',
            db.sequelize.fn(
              'CONVERT_TZ',
              db.sequelize.col('todo.createdAt'),
              '+00:00',
              '+09:00',
            ),
          ),
          '=',
          date.format('YYYY-MM-DD'),
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

    // const todos = await db.Todo.findAll({
    //   where: [
    //     db.sequelize.where(
    //       db.sequelize.fn('date', db.sequelize.col('todo.startLocalDate')),
    //       '=',
    //       date.format('YYYYMMDD'),
    //     ),
    //     { userId: req.user.id },
    //   ],
    //   attributes: [
    //     'id',
    //     'todoContent',
    //     'doneContent',
    //     'duration',
    //     'isComplete',
    //   ],
    //   include: [
    //     { model: db.Timeline, attributes: ['id', 'startedAt', 'endedAt'] },
    //   ],
    // });

    res
      .status(200)
      .json({ code: 200, message: 'todos inquiry success.', data: todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'todos inquiry failed.' });
  }
};

module.exports = { getTodos };
