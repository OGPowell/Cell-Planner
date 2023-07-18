var EntitySchema = require('typeorm').EntitySchema;
var Part = require('../model/part');

module.exports = new EntitySchema({
  name: 'Part',
  target: Part,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
    },
    name: {
      type: 'varchar',
    },
  },
  relations: {
    processes: {
      type: 'one-to-many',
      target: 'Process',
      inverseSide: 'part',
      cascade: true,
    },
  },
});