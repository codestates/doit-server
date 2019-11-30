const express = require('express');

const { verifyToken } = require('../controllers/middleware');
const { getTodos } = require('../controllers/todos');

const router = express.Router();

// GET api/todos/:date
router.get('/:date', verifyToken, getTodos);

module.exports = router;
