const router = require('express').Router();

const db = require('../models');
const { isLoggedIn } = require('./middleware');

// POST api/todo -- todo 생성
router.post('/', isLoggedIn, async (req, res) => {
  let transaction;
  try {
    const { todoContent, startedAt, duration } = req.body;
    transaction = await db.sequelize.transaction();
    const newTodo = await db.Todo.create(
      { todoContent, duration, userId: req.user.id },
      { transaction },
    );
    const newTimeline = await db.Timeline.create(
      { startedAt, todoId: newTodo.id },
      { transaction },
    );
    await transaction.commit();
    return res.status(200).json({
      code: 200,
      message: 'todo create success',
      data: { todoId: newTodo.id, timelineId: newTimeline.id },
    });
  } catch (error) {
    console.error(error);
    transaction && (await transaction.rollback());
    return res.status(500).json({
      code: 500,
      message: 'todo create fail',
    });
  }
});

// POST api/todo/pause -- todo 멈춤
router.post('/pause', isLoggedIn, async (req, res) => {
  try {
    const { todoId, timelineId, endedAt } = req.body;
    const todo = await db.Todo.findOne({
      where: { id: todoId, userId: req.user.id },
    });
    if (!todo) {
      return res.status(204).json({ code: 204, message: 'Todo not found.' });
    }
    await db.Timeline.update(
      { endedAt },
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
      message: 'todo pause failed',
    });
  }
});

// POST api/todo/resume-- todo 다시 시작
router.post('/resume', isLoggedIn, async (req, res) => {
  try {
    const { todoId, startedAt } = req.body;
    const todo = await db.Todo.findOne({
      where: { id: todoId, userId: req.user.id },
    });
    if (!todo) {
      return res.status(204).json({ code: 204, message: 'Todo not found.' });
    }
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
});

// POST api/todo -- todo 종료
router.patch('/', isLoggedIn, async (req, res) => {
  let transaction;
  try {
    const { todoId, timelineId, doneContent, endedAt } = req.body;
    const todo = await db.Todo.findOne({
      where: { id: todoId, userId: req.user.id },
    });
    if (!todo) {
      return res.status(204).json({ code: 204, message: 'Todo not found.' });
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
});

// GET api/todo/:todoId
router.get('/:todoId', isLoggedIn, async (req, res) => {
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
      return res.status(204).json({ code: 204, message: 'todo not found.' });
    }
    return res
      .status(200)
      .json({ code: 200, message: 'todo select success.', data: todo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: 'todo select failed.' });
  }
});

// DELETE api/todo/:todoId
router.delete('/:todoId', isLoggedIn, async (req, res) => {
  try {
    const todo = await db.Todo.findOne({
      where: { id: req.params.todoId, userId: req.user.id },
      include: [{ model: db.Timeline }],
    });
    if (!todo) {
      return res.status(204).json({ code: 204, message: 'todo not found.' });
    }

    await db.Todo.destroy({
      where: { id: req.params.todoId, userId: req.user.id },
    });
    res.status(200).json({ code: 200, message: 'todo delete success.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'todo delete failed.' });
  }
});

module.exports = router;
