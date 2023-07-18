const AppDataSource = require('../typeorm.config');
const { ipcMain } = require('electron');

// Create Items
ipcMain.on('create-item', async (event, repoName, object) => {
    let message;
    try {
        // get the repo and save or update
        const repo = AppDataSource.getRepository(repoName);
        await repo.save(object)
            .then(savedObject => {
                message = 'Item created successfully: ';
                event.sender.send('save-data-success', message, savedObject);
            })
    }
    catch (error) {
        message = 'Item creation failed: ';
        event.sender.send('save-data-error', message, error.message, error.stack);
    }
});

// Read Items
ipcMain.on('read-item', async (event, repoName, searchField, searchText) => {
    try {
        if (repoName === 'config') {
            const readItem = await AppDataSource.getRepository(repoName).find(searchText)
            event.returnValue = readItem;
            return;
        }

        const repo = AppDataSource.getRepository(repoName);
        let queryBuilder = repo.createQueryBuilder(repoName);

        if (repoName === 'week') {
            queryBuilder = queryBuilder
                .leftJoinAndSelect('week.days', 'day')
                .orderBy('day.date', 'ASC')
                .leftJoinAndSelect('day.jobs', 'job')
                .leftJoinAndSelect('job.part', 'part')
                .leftJoinAndSelect('part.processes', 'process')
                .where('week.' + searchField + '= :searchText', { searchText });
        }
        else if (repoName === 'day') {
            queryBuilder = queryBuilder
                .leftJoinAndSelect('day.jobs', 'job')
                .leftJoinAndSelect('job.part', 'part')
                .leftJoinAndSelect('part.processes', 'process')
                .where('day.' + searchField + '= :searchText', { searchText });
        }
        else if (repoName === 'job') {
            queryBuilder = queryBuilder
                .leftJoinAndSelect('job.part', 'part')
                .leftJoinAndSelect('part.processes', 'process')
                .where('job.' + searchField + '= :searchText', { searchText });
        }
        else if (repoName === 'part') {
            queryBuilder = queryBuilder.leftJoinAndSelect('part.processes', 'process')
                .where('part.' + searchField + '= :searchText', { searchText });
        }

        const queryItem = await queryBuilder.getOne();

        if (queryItem !== null) {
            event.returnValue = queryItem;
        } else {
            event.returnValue = queryItem;
        }
    }
    catch (error) {
        var message = "Error reading data: ";
        event.sender.send('save-data-error', message, error.message, error.stack);
    }
});

// Update items
ipcMain.on('update-day', async (event, day, job) => {
    let message;
    try {
        // add the child to the parent
        await AppDataSource
            .createQueryBuilder()
            .relation("Job", "day")
            .of(job)
            .set(day)

        message = 'Success updating job ' + job + " with day: " + day + '!';
        event.sender.send('save-data-success', message);
    }
    catch (error) {
        message = 'Error updating job ' + job + " with day: " + day + '!';
        event.sender.send('save-data-error', message, error.message, error.stack);
    }
});

// Delete Items
ipcMain.on('delete-item', async (event, repoName, id) => {
    let message;
    try {
        // get the repo and delete
        const repo = AppDataSource.getRepository(repoName);
        let savedObject = await repo.delete(id)
        console.log('Deleted item with id: ' + id + '!')

        // log it
        message = 'Item deleted successfully: ';
        event.sender.send('save-data-success', message, savedObject);
    }
    catch (error) {
        message = 'Item deletion failed: ';
        event.sender.send('save-data-error', error.message, error.stack);
    }
});

ipcMain.on('get-parts', async (event, text) => {
    let message;
    try {
        const parts = await AppDataSource
            .getRepository('part')
            .createQueryBuilder('part')
            .leftJoinAndSelect('part.processes', 'process')
            .where('part.name LIKE :name', { name: `%${text}%` })
            .getMany();

        if (parts.length === 0) {
            console.log('No matching parts yet...')
            event.returnValue = null;
        } else {
            event.returnValue = parts;
            message = 'Successfully got parts: ';
            event.sender.send('save-data-success', message, parts);
        }
    }
    catch (error) {
        message = 'Error getting parts: ';
        event.sender.send('save-data-error', error.message, error.stack);
    }
})