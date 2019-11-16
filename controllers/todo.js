const db = require('../models');
const validate = require('../utils/validate');

const createTodo = async (req, res) => {
  let transaction;
  try {
    const { todoContent, startedAt, duration } = req.body;

    const validContent = validate.content(todoContent);
    const validStartedAt = validate.timestamp(startedAt);
    const validDuration = validate.duration(duration);

    // 기능별 모듈화 고려
    if (!validContent || !validStartedAt || !validDuration) {
      let contentError = !validContent ? 'content error' : '';
      let startError = !validStartedAt
        ? !validContent
          ? ' & start time error'
          : 'start time error'
        : '';
      let durationError = !validDuration
        ? !validContent || !validStartedAt
          ? ' & duration error'
          : 'duration error'
        : '';
      throw new Error(`${contentError}${startError}${durationError}`);
    }

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
    const validEndedAt = validate.timestamp(endedAt);
    if (!validEndedAt) {
      throw new Error('End time error');
    }

    await db.Timeline.update(
      { endedAt: validEndedAt },
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
    const validResumedAt = validate.timestamp(startedAt);
    if (!validResumedAt) {
      throw new Error('Resume time error');
    }

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
    doneContent = validate.content(doneContent);
    endedAt = validate.timestamp(endedAt);
    if (!doneContent) {
      doneContent = 'ok';
    }
    if (!endedAt) {
      throw new Error('complete time error');
    }

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
