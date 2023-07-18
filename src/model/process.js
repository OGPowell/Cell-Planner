const { v4: uuidv4 } = require('uuid');

class Process {
  constructor(name, time) {
    this.id = uuidv4();
    this.name = name;
    this.time = time;
  }
}

module.exports = Process;