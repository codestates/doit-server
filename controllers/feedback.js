const Slack = require('slack-node');

const db = require('../models');

const webhookUri = process.env.SLACKwebhookURL;
const slack = new Slack();
slack.setWebhook(webhookUri);
const send = async (message) => {
  slack.webhook(
    {
      channel: '#doit-feedback', // 전송될 슬랙 채널
      username: message.nickname, //슬랙에 표시될 이름
      text: message.content,
    },
    function(err, response) {
      console.log(response);
    },
  );
};

const feedback = async (req, res, next) => {
  const { content } = req.body;

  try {
    await db.Feedback.create({
      content,
      userId: req.user.id,
      nickname: req.user.nickname,
    });

    send({ nickname: req.user.nickname, content });

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
