const router = require('express').Router();

const { verifyToken } = require('../controllers/middleware');
const feedback = require('./../controllers/feedback');

// POST api/feedback
router.post('/', verifyToken, feedback);

module.exports = router;
