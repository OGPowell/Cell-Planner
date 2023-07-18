const typeorm = require('typeorm');
const path = require('path');

var AppDataSource = new typeorm.DataSource({
    type: 'sqlite',
    database: path.join(__dirname, 'cell-planner.db'),
    synchronize: true,
    logging: 'error',
    entities: [
        require('./src/entity/configSchema'),
        require('./src/entity/daySchema'), 
        require('./src/entity/jobSchema'),
        require('./src/entity/partSchema'),
        require('./src/entity/processSchema'),
        require('./src/entity/weekSchema'),
    ],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

module.exports = AppDataSource;