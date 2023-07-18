const { v4: uuidv4 } = require('uuid');

class Config {
    constructor(isFirstTime) {
        this.id = uuidv4();
        this.isFirstTime = isFirstTime;
    }
}

module.exports = Config;