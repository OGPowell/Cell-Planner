const { ipcMain } = require('electron');
const Week = require("../../../model/week");
const Day = require('../../../model/day');
const Config = require('../../../model/config');
const Job = require('../../../model/job');
const Part = require('../../../model/part');
const Process = require('../../../model/process');

ipcMain.on('create-config-object', (event, isFirstTime) => {
    let config = new Config(isFirstTime);
    event.returnValue = config;
})

ipcMain.on('create-week-object', (event, startDate) => {
    startDate = getPreviousMonday(startDate);
    let week = new Week(startDate.toISOString().split('T')[0]);
    let days = createDays(startDate);
    week.days = days;
    event.returnValue = week;
});

ipcMain.on('create-job-object', (event, date, workOrder, part) => {
    var job = new Job(date, workOrder, part);
    event.returnValue = job;
});

ipcMain.on('create-part-object', (event, partNumber) => {
    var part = new Part(partNumber);
    event.returnValue = part;
});

ipcMain.on('create-process-object', (event, processName, processTime) => {
    var process = new Process(processName, processTime);
    event.returnValue = process;
});

// helper functions
function getPreviousMonday(date) {
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const previousMonday = new Date(date.getTime());
    previousMonday.setDate(date.getDate() - diff);
    return previousMonday;
}

function createDays(startDate) {
    const days = [];
    const options = { weekday: 'long' };
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dayName = date.toLocaleDateString(undefined, options);
        const day = new Day(date.toISOString().split('T')[0], dayName);
        days.push(day);
    }
    
    return days;
}


