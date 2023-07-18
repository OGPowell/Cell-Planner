var EntitySchema = require('typeorm').EntitySchema;
var Config = require('../model/config');

// Define the config entity
module.exports = new EntitySchema({
    name: 'Config',
    target: Config,
    columns: {
        id: {
            primary: true,
            type: 'varchar',
        },
        isFirstTime: {
            type: 'boolean',
        }
    }
});
