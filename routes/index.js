const router = require('express').Router();

const userRouter = require('./user');
const todoRouter = require('./todo');
const todosRouter = require('./todos');

router.use('/user', userRouter);
router.use('/todo', todoRouter);
router.use('/todos', todosRouter);

module.exports = router;
