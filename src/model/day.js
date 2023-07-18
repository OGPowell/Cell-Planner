const { v4: uuidv4 } = require('uuid');

class Day {
  constructor(date, name) {
    this.id = uuidv4();
    this.name = name;
    this.date = date;
    this.jobs = null;
  }
};

module.exports = Day;