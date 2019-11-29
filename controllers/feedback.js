const db = require('../models');

const feedback = async (req, res, next) => {
  const { content, userId, nickname } = req.body;

  try {
    await db.Feedback.create({
      content,
      userId,
      nickname,
    });
    res.status(200).json({
      code: 200,
      message: 'thank you for your feedback',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: 'feedback submit failed' });
  }
};

module.exports = feedback;
