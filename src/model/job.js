const { v4: uuidv4 } = require('uuid');

class Job {
  constructor(date, workOrder, part) {
    this.id = uuidv4();
    this.date = date;
    this.workOrder = workOrder;
    this.part = part;
  }
}

module.exports = Job;