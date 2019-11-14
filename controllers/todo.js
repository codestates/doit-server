const db = require('../models');
const validate = require('../utils/validate');

const createTodo = async (req, res, next) => {
  let transaction;
  try {
    const { todoContent, startedAt, duration } = req.body;
    const validContent = validate.content(todoContent);
    const validStartedAt = validate.timestamp(startedAt);
    const validDuration = validate.duration(duration);

    transaction = await db.sequelize.transaction();
    const newTodo = await db.Todo.create(
      {
        todoContent: validContent,
        duration: validDuration,
        userId: req.user.id,
      },
      { transaction },
    );
    const newTimeline = await db.Timeline.create(
      {
        startedAt: validStartedAt,
        todoId: newTodo.id,
      },
      { transaction },
    );
    await transaction.commit();
    res.status(200).json({
      // return을 붙일 필요가 있나?
      code: 200,
      message: 'todo create success',
      data: { todoId: newTodo.id, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    transaction && (await transaction.rollback()); // 이렇게 써줄 이유?
    return res.status(500).json({
      code: 500,
      message: `todo create fail. ${error.message}`,
    });
  }
};

const pauseTodo = async (req, res) => {
  try {
    const { todoId, timelineId, endedAt } = req.body;
    const validEndedAt = validate.timestamp(endedAt);

    await db.Timeline.update(
      { endedAt: validEndedAt },
      { where: { id: timelineId, todoId } },
    );
    return res.status(200).json({
      code: 200,
      message: 'todo paused successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: `todo pause failed. ${error.message}`,
    });
  }
};

const resumeTodo = async (req, res) => {
  try {
    const { todoId, startedAt } = req.body;
    const newTimeline = await db.Timeline.create({ startedAt, todoId });
    return res.status(200).json({
      code: 200,
      message: 'Resume success.',
      data: { todoId, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: 'Resume failed.',
    });
  }
};

const completeTodo = async (req, res) => {
  let transaction;
  try {
    const { todoId, timelineId, doneContent, endedAt } = req.body;
    transaction = await db.sequelize.transaction();
    await db.Todo.update(
      { doneContent, isComplete: true },
      { where: { id: todoId, userId: req.user.id } },
      { transaction },
    );
    await db.Timeline.update(
      { endedAt },
      { where: { id: timelineId, todoId } },
      { transaction },
    );
    await transaction.commit();

    return res.status(200).json({
      code: 200,
      message: 'todo complete success',
    });
  } catch (error) {
    console.error(error);
    transaction && (await transaction.rollback());
    res.status(500).json({
      code: 500,
      message: 'todo complete failed',
    });
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
    return res
      .status(200)
      .json({ code: 200, message: 'todo select success.', data: todo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: 'todo select failed.' });
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
    res.status(200).json({ code: 200, message: 'todo delete success.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'todo delete failed.' });
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
