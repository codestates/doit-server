const router = require('express').Router();

const db = require('../models');

router.post('/', async (req, res) => {
  try {
    const { todoContent, startedAt, duration, userId } = req.body;
    const newTodo = await db.Todo.create({
      todoContent,
      startedAt,
      duration,
      userId,
    });
    res.status(200).json({
      code: 200,
      message: 'todo create success',
      todoId: newTodo.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: 'todo create fail',
    });
  }
});

router.post('/pause', async (req, res) => {
  try {
    const { todoId, endedAt } = req.body;
    await db.Todo.update({ endedAt }, { where: { id: todoId } });
    res.status(200).json({
      code: 200,
      message: 'todo paused successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: 'todo pause failed',
    });
  }
});

router.patch('/', async (req, res) => {
  try {
    const { todoId, doneContent, endedAt } = req.body;
    await db.Todo.update(
      { doneContent: doneContent, endedAt: endedAt },
      { where: { id: todoId } },
    );
    res.status(200).json({
      code: 200,
      message: 'todo complete success',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: 'todo complete failed',
    });
  }
});

module.exports = router;
