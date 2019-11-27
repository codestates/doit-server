const moment = require('moment');
const db = require('../models');

const getTodos = async (req, res) => {
  try {
    const utcFrom = moment(req.params.date).utc();
    const utcTo = utcFrom.clone().add(1, 'd');
    const Op = db.Sequelize.Op;
    const todos = await db.Todo.findAll({
      where: {
        createdAt: {
          [Op.gte]: utcFrom,
          [Op.lt]: utcTo,
        },
        userId: req.user.id,
      },
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

    res
      .status(200)
      .json({ code: 200, message: 'todos inquiry success.', data: todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'todos inquiry failed.' });
  }
};

module.exports = { getTodos };
