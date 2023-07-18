var EntitySchema = require('typeorm').EntitySchema;
var Process = require('../model/process');

module.exports = new EntitySchema({
  name: 'Process',
  target: Process,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
    },
    name: {
      type: 'varchar',
    },
    time: {
      type: 'integer',
    },
  },
  relations: {
    part: {
      type: 'many-to-one',
      target: 'Part',
      inverseSide: 'processes',
    },
  },
});
