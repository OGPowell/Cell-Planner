const { v4: uuidv4 } = require('uuid');

class Part {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.processes = null;
  }
}

module.exports = Part;