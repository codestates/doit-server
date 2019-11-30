const moment = require('moment');
const db = require('../models');

const getTodosContent = async (date, userId) => {
  try {
    const utcFrom = moment(date).utc();
    const utcTo = utcFrom.clone().add(1, 'd');
    const Op = db.Sequelize.Op;
    const todos = await db.Todo.findAll({
      where: {
        createdAt: {
          [Op.gte]: utcFrom,
          [Op.lt]: utcTo,
        },
        userId,
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
    return todos;
  } catch (error) {
    throw error;
  }
};

const getTodosCount = async (date, userId) => {
  try {
    const query = `
    SELECT createdDate, COUNT(*) AS count
    FROM (
      SELECT DATE(CONVERT_TZ(createdAt, '+00:00','+09:00')) createdDate
      FROM doit.todos
      WHERE userId = :userId
      AND createdAt >= LAST_DAY(:date - INTERVAL 1 MONTH) -- lastDayOfBeforeMonth 
      AND createdAt <= LAST_DAY(:date) + INTERVAL 1 DAY -- firstDayOfNextMonth
    ) a
    GROUP BY createdDate`;

    const todosCount = await db.sequelize.query(query, {
      replacements: {
        userId,
        date: moment(date)
          .utc()
          .format('YYYY-MM-DD'),
      },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return todosCount;
  } catch (error) {
    throw error;
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await getTodosContent(req.params.date, req.user.id);
    const todosCount = await getTodosCount(req.params.date, req.user.id);
    res.status(200).json({
      code: 200,
      message: 'todos inquiry success.',
      data: { todos, todosCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'todos inquiry failed.' });
  }
};

module.exports = { getTodos };
