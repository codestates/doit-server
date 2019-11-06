const router = require('express').Router();

const db = require('../models');

router.get('/:userId', async (req, res) => {
  try {
    // const { userId } = req.params; --> req.user  로그인 완성되면 처리.
    const userInfo = await db.User.findOne({
      where: {
        id: userId,
      },
    });
    if (!userInfo) {
      res.status(200).send({
        code: 200,
        message: 'there is no such user',
        data: null,
      });
    } else {
      // 비밀번호 제외하고 userInfo넣기. --> req.user
      res.status(200).send({
        code: 200,
        message: 'user identified',
        data: userInfo,
      });
    }
  } catch {
    res.status(500).send({
      code: 500,
      message: 'failed to get user',
    });
  }
});

module.exports = router;
