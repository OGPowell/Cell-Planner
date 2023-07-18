var EntitySchema = require('typeorm').EntitySchema;
var Day = require('../model/day');

module.exports = new EntitySchema({
  name: 'Day',
  target: Day,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
    },
    name: {
      type: 'varchar',
    },
    date: {
      type: 'varchar',
    },
  },
  relations: {
    week: {
      type: 'many-to-one',
      target: 'Week',
      join_column: {
        name: 'week_id',
      },
      inverseSide: 'days',
    },
    jobs: {
      type: 'one-to-many',
      target: 'Job',
      inverseSide: 'day',
      cascade: true,
    },
  },
});
