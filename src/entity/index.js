// Export models
console.log('Exporting schema...')
exports.Config = require('./configSchema')
exports.Day = require('./daySchema')
exports.Job = require('./jobSchema')
exports.Part = require('./partSchema')
exports.Week = require('./weekSchema')
exports.Process = require('./processSchema')