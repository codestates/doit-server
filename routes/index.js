const router = require('express').Router();

const userRouter = require('./user');
const todoRouter = require('./todo');
const todosRouter = require('./todos');
const feedbackRouter = require('./feedback');

router.use('/user', userRouter);
router.use('/todo', todoRouter);
router.use('/todos', todosRouter);
router.use('/feedback', feedbackRouter);

module.exports = router;
