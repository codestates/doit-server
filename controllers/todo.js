const db = require('../models');
const Validation = require('../utils/validation');

const createTodo = async (req, res) => {
  let transaction;
  try {
    const { todoContent, startedAt, duration } = req.body;

    const validation = new Validation();
    validation.verifyContent(todoContent);
    validation.verifyTimestamp(startedAt);
    validation.verifyDuration(duration);
    validation.checkError();

    transaction = await db.sequelize.transaction();
    const newTodo = await db.Todo.create(
      {
        todoContent: validation.content,
        duration: validation.duration,
        userId: req.user.id,
      },
      { transaction },
    );
    const newTimeline = await db.Timeline.create(
      {
        startedAt: validation.duration,
        todoId: newTodo.id,
      },
      { transaction },
    );
    await transaction.commit();
    res.status(200).json({
      code: 200,
      message: 'todo created successfully',
      data: { todoId: newTodo.id, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    transaction && (await transaction.rollback());
    res.status(500).json({
      code: 500,
      message: `todo creation failed. ${error.message}`, // 서버 쪽 에러인 경우와 형식 에러인 경우 나눠야 함. 서버쪽 에러일 때 자동으로 뜨는 메세지는?
    });
  }
};

const pauseTodo = async (req, res) => {
  try {
    const { todoId, timelineId, endedAt } = req.body;

    const validation = new Validation();
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
    res.status(500).json({
      code: 500,
      message: `todo pause failed. ${error.message}`, // 서버 쪽 에러인 경우와 형식 에러인 경우 나눠야 함.
    });
  }
};

const resumeTodo = async (req, res) => {
  try {
    const { todoId, startedAt } = req.body;

    const validation = new Validation();
    validation.verifyTimestamp(startedAt);
    validation.checkError();

    const newTimeline = await db.Timeline.create({ startedAt, todoId });
    return res.status(200).json({
      code: 200,
      message: 'Resumed successfully.',
      data: { todoId, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: `Resume failed ${error.message}.`, // 서버 쪽 에러인 경우와 형식 에러인 경우 나눠야 함.
    });
  }
};

const completeTodo = async (req, res) => {
  let transaction;
  try {
    const { todoId, timelineId, doneContent, endedAt } = req.body;

    const validation = new Validation();
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
    transaction && (await transaction.rollback());
    res.status(500).json({
      code: 500,
      message: `todo completion failed. ${error.message}`,
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
      .json({ code: 500, message: 'todo delete failed d/t server problem' });
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
