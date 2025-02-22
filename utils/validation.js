const moment = require('moment');

class Validation {
  constructor() {
    this.errorMessages = [];
  }

  verifyContent(content) {
    const result = content.trim();
    if (result.length) {
      this.content = result;
    } else {
      this.errorMessages.push('content error');
    }
  }

  verifyTimestamp(timestamp) {
    const result = moment(timestamp);
    if (result.isValid()) {
      this.timestamp = timestamp;
    } else {
      this.errorMessages.push('time error');
    }
  }

  verifyDuration(duration) {
    const result = parseInt(duration, 10);
    if (!Number.isNaN(result) && result >= 0) {
      this.duration = result;
    } else {
      this.errorMessages.push('duration error');
    }
  }

  checkError() {
    if (this.errorMessages.length) {
      throw new Error(this.errorMessages.join(' & '));
    }
  }
}

module.exports = Validation;
