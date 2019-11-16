const router = require('express').Router();

const {
  isLoggedIn,
  isExistTodo,
  isExistTimeline,
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
router.post('/', isLoggedIn, createTodo);

// POST api/todo/pause -- todo 멈춤
router.post('/pause', isLoggedIn, isExistTodo, isExistTimeline, pauseTodo);

// POST api/todo/resume-- todo 다시 시작
router.post('/resume', isLoggedIn, isExistTodo, resumeTodo);

// POST api/todo -- todo 종료
router.patch('/', isLoggedIn, isExistTodo, isExistTimeline, completeTodo);

// GET api/todo/:todoId
router.get('/:todoId', isLoggedIn, getTodo);

// DELETE api/todo/:todoId
router.delete('/:todoId', isLoggedIn, deleteTodo);

module.exports = router;
