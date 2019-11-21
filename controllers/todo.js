const moment = require('moment');

const db = require('../models');
const Validation = require('../utils/validation');

const calcLocalDateFromUTC = (utc) => {
  return moment(utc).format('YYYY-MM-DD');
};

const createTodo = async (req, res) => {
  let transaction;
  const validation = new Validation();
  try {
    const { todoContent, startedAt, duration } = req.body;

    validation.verifyContent(todoContent);
    validation.verifyTimestamp(startedAt);
    validation.verifyDuration(duration);
    validation.checkError(res);

    transaction = await db.sequelize.transaction();
    const todoStartLocalDate = calcLocalDateFromUTC(validation.timestamp);
    const newTodo = await db.Todo.create(
      {
        todoContent: validation.content,
        duration: validation.duration,
        startLocalDate: todoStartLocalDate,
        userId: req.user.id,
      },
      { transaction },
    );
    const newTimeline = await db.Timeline.create(
      {
        startedAt: validation.timestamp,
        todoId: newTodo.id,
      },
      { transaction },
    );
    await transaction.commit();
    res.status(201).json({
      code: 201,
      message: 'todo created successfully',
      data: { todoId: newTodo.id, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    if (validation.errorMessages.length) {
      res.status(400).json({
        code: 400,
        message: error.message,
      });
    } else {
      transaction && (await transaction.rollback());
      res.status(500).json({
        code: 500,
        message: `todo creation failed. ${error.message}`,
      });
    }
  }
};

const pauseTodo = async (req, res) => {
  const validation = new Validation();
  try {
    const { todoId, timelineId, endedAt } = req.body;

    validation.verifyTimestamp(endedAt);
    validation.checkError();

    await db.Timeline.update(
      { endedAt: validation.timestamp },
      { where: { id: timelineId, todoId } },
    );
    res.status(200).json({
      code: 200,
      message: 'todo paused successfully',
    });
  } catch (error) {
    console.error(error);
    if (validation.errorMessages.length) {
      res.status(400).json({
        code: 400,
        message: error.message,
      });
    } else {
      res.status(500).json({
        code: 500,
        message: `todo pause failed. ${error.message}`,
      });
    }
  }
};

const resumeTodo = async (req, res) => {
  const validation = new Validation();
  try {
    const { todoId, startedAt } = req.body;

    validation.verifyTimestamp(startedAt);
    validation.checkError();

    const newTimeline = await db.Timeline.create({ startedAt, todoId });
    res.status(201).json({
      code: 201,
      message: 'Resumed successfully.',
      data: { todoId, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    if (validation.errorMessages.length) {
      res.status(400).json({
        code: 400,
        message: error.message,
      });
    } else {
      res.status(500).json({
        code: 500,
        message: `Resume failed ${error.message}.`,
      });
    }
  }
};

const completeTodo = async (req, res) => {
  let transaction;
  const validation = new Validation();
  try {
    const { todoId, timelineId, doneContent, endedAt } = req.body;

    validation.verifyTimestamp(endedAt);
    validation.checkError();

    const validDoneContent = doneContent.trim().length
      ? doneContent.trim()
      : 'OK';

    transaction = await db.sequelize.transaction();
    await db.Todo.update(
      {
        doneContent: validDoneContent,
        isComplete: true,
      },
      { where: { id: todoId, userId: req.user.id } },
      { transaction },
    );
    await db.Timeline.update(
      { endedAt: validation.timestamp },
      { where: { id: timelineId, todoId } },
      { transaction },
    );
    await transaction.commit();

    res.status(200).json({
      code: 200,
      message: 'todo completed successfully',
    });
  } catch (error) {
    console.error(error);
    if (validation.errorMessages.length) {
      return res.status(400).json({
        code: 400,
        message: error.message,
      });
    } else {
      transaction && (await transaction.rollback());
      res.status(500).json({
        code: 500,
        message: `todo completion failed. ${error.message}`,
      });
    }
  }
};

const getTodo = async (req, res) => {
  try {
    const todo = await db.Todo.findOne({
      where: { id: req.params.todoId, userId: req.user.id },
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
    if (!todo) {
      return res.status(400).json({ code: 400, message: 'todo not found.' });
    }
    res
      .status(200)
      .json({ code: 200, message: 'todo found successfully.', data: todo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ code: 500, message: 'finding todo failed d/t server problem.' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await db.Todo.findOne({
      where: { id: req.params.todoId, userId: req.user.id },
    });
    if (!todo) {
      return res.status(400).json({ code: 400, message: 'todo not found.' });
    }

    await db.Todo.destroy({
      where: { id: req.params.todoId, userId: req.user.id },
    });
    res.status(200).json({ code: 200, message: 'todo deleted successfully.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ code: 500, message: `todo delete failed, ${error.message}` });
  }
};

module.exports = {
  createTodo,
  pauseTodo,
  resumeTodo,
  completeTodo,
  getTodo,
  deleteTodo,
};
