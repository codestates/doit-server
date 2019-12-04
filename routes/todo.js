const router = require('express').Router();

const {
  isExistTodo,
  isExistTimeline,
  verifyToken,
} = require('../controllers/middleware');
const {
  createTodo,
  pauseTodo,
  resumeTodo,
  completeTodo,
  getTodo,
  deleteTodo,
} = require('../controllers/todo');

// POST api/todo -- todo 생성
router.post('/', verifyToken, createTodo);

// POST api/todo/pause -- todo 멈춤
router.post('/pause', verifyToken, isExistTodo, isExistTimeline, pauseTodo);

// POST api/todo/resume-- todo 다시 시작
router.post('/resume', verifyToken, isExistTodo, resumeTodo);

// PATCH api/todo -- todo 종료
router.patch('/', verifyToken, isExistTodo, isExistTimeline, completeTodo);

// GET api/todo/:todoId
router.get('/:todoId', verifyToken, getTodo);

// DELETE api/todo/:todoId
router.delete('/:todoId', verifyToken, deleteTodo);

module.exports = router;
