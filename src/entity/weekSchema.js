var EntitySchema = require('typeorm').EntitySchema;
var Week = require('../model/week');

module.exports = new EntitySchema({
  name: 'Week',
  target: Week,
  columns: {
    id: {
      type: 'varchar',
      primary: true,
    },
    startDate: {
      type: 'date',
    },
  },
  relations: {
    days: {
      type: 'one-to-many',
      target: 'Day',
      inverseSide: 'week',
      cascade: true,
    },
  },
});