var EntitySchema = require('typeorm').EntitySchema;
var Job = require('../model/job');

module.exports = new EntitySchema({
  name: 'Job',
  target: Job,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
    },
    date: {
      type: 'varchar',
    },
    workOrder: {
      type: 'varchar',
    },
  },
  relations: {
    day: {
      type: 'many-to-one',
      target: 'Day',
      inverseSide: 'jobs',
      join_column: {
        name: 'dayId',  
      }
    },
    part: {
      type: 'many-to-one',
      target: 'Part',
      join_column: {
        name: 'partId',
      },
      cascade: true,
    },
  },
});