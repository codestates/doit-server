const router = require('express').Router();

const feedback = require('./../controllers/feedback');

// POST api/feedback
router.post('/', feedback);

module.exports = router;
