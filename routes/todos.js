const express = require('express');

const { isLoggedIn } = require('../controllers/middleware');
const { getTodos } = require('../controllers/todos');

const router = express.Router();

// GET api/todos/:date
router.get('/:date', isLoggedIn, getTodos);

module.exports = router;
