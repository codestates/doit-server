const moment = require('moment');

const validate = {};

validate.content = (content) => {
  const result = content.trim();
  if (!result.length) {
    return false;
  }
  return result;
};

validate.timestamp = (timestamp) => {
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const result = moment(timestamp, dateFormat, true);
  if (!result.isValid()) {
    return false;
  }
  return result;
};

validate.duration = (duration) => {
  const result = parseInt(duration, 10);
  return Number.isNaN(result) ? false : result;
};

module.exports = validate;

// 배열에 error push 해서 빼는법 생각.
