const { ipcRenderer } = require("electron");

// Create config object
function getConfigObject() {
    var isFirstTime = ipcRenderer.send('read-item', 'config', 'isFirstTime');

    if (isFirstTime.length == 0) {
        console.log('Creating config object')
        var config = ipcRenderer.send('create-config-object', false);
        ipcRenderer.send("create-item", config);
        return true;
    }
    return false;
}

function getWeekObject(startDate) {
    // Search the database for the week by its start date
    startDate = getPreviousMonday(startDate);
    var week = ipcRenderer.sendSync('read-item', 'week', 'startDate', startDate.toISOString().split('T')[0]);

    // if no week is found create it
    if (week === null) {
        var week = ipcRenderer.sendSync('create-week-object', startDate);

        // Send the objects to the database
        ipcRenderer.send("create-item", 'week', week);
    }
    return week;
}

function getPartObject(partName, processes) {
    let part = ipcRenderer.sendSync('read-item', 'part', 'name', partName);

    if (!part) {
        // part does not exist so create it
        part = ipcRenderer.sendSync('create-part-object', partName);

        // add the processes to the part, these are unique to the part
        part.processes = processes;
    }
    return part;
}

function getJobObject(job, day) {
    // check if the job exists in the database
    // job and day can be either object or id
    if (typeof job === 'string' || job instanceof String) {
        // job is an id so get the job from the database
        job = ipcRenderer.sendSync('read-item', 'job', 'id', job);
        ipcRenderer.send('update-day', day, job);
    } else {
        // job is an object so create it
        job.day = day.id
        ipcRenderer.send('create-item', 'job', job);
    }

    return job;
}

function getAllJobs(id) {
    // get all of the jobs in a given day and return their parts
    var day = ipcRenderer.sendSync('read-item', 'day', 'id', id);

    if (day == null) {
        return null;
    }

    let parts = [];
    day.jobs.forEach(job => {
        parts.push(job.part);
    });

    return parts;
}

function deleteJob(id) {
    // delete the job from the database
    ipcRenderer.send('delete-item', 'job', id);
}

// helper functions
function getPreviousMonday(date) {
    const dayOfWeek = date.getDay();

    // check if it is already monday
    if (dayOfWeek == 1) {
        return date;
    }
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const previousMonday = new Date(date.getTime());
    previousMonday.setDate(date.getDate() - diff);
    return previousMonday;
}

ipcRenderer.on('save-data-success', (event, message, savedObject) => {
    console.log(message, savedObject)
});

ipcRenderer.on('save-data-error', (event, message, errorMessage, errorStack) => {
    console.error(message, errorMessage, errorStack)
});

module.exports = {
    createConfigObject: getConfigObject,
    getWeekObject,
    getJobObject,
    getPartObject,
    getAllJobs,
    deleteJob
}