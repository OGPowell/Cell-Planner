const { v4: uuidv4 } = require('uuid');

class Week {
  constructor(startDate) {
    this.id = uuidv4();
    this.startDate = startDate;
    this.days = null;
  }
}

module.exports = Week;