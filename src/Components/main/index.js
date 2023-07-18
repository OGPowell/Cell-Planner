const { getWeekObject } = require('./app/addRemoveObject');
const { renderWeek } = require('./render/render');

// Startup functions and initialization
// wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    load();
});

let currentWeekContainer;

function load() {
    var week = getWeekObject(new Date());
    var weekContainer = renderWeek(week)
    currentWeekContainer = weekContainer;

    updateContainerWidths(); // Update the container widths to ensure consistent sizing
    setCurrentWeek(weekContainer);
}

// Help Window Event Listeners
// Function to toggle help section
const helpButton = document.getElementById('help-button');
const helpSection = document.getElementById('help-text-field');
const collapseButton = document.getElementById('collapse-button');

// Toggle the help button
helpButton.addEventListener('click', () => {
    helpSection.classList.toggle('hidden');
});

// Toggle the collapse button
collapseButton.addEventListener('click', () => {
    helpSection.classList.toggle('hidden');
});

// Calendar Container
var previousWeekButton = document.querySelector(".previous-week-button");
var nextWeekButton = document.querySelector(".next-week-button");

// Event handler for previous week button click
previousWeekButton.addEventListener('click', function () {
    var previousWeekContainer = currentWeekContainer.previousElementSibling;

    if (previousWeekContainer) {
        setCurrentWeek(previousWeekContainer);

        // update container widths
        updateContainerWidths();

        previousWeekContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        previousWeekContainer.focus(); // Set focus to the week container
    } else {
        var previousWeekStartDate = new Date(currentWeekContainer.dataset.startDate)
        previousWeekStartDate.setDate(new Date(previousWeekStartDate).getDate() - 8);
        console.log(previousWeekStartDate);

        var week = getWeekObject(previousWeekStartDate);
        previousWeekContainer = renderWeek(week);

        console.log(previousWeekContainer);

        // update container widths
        updateContainerWidths();
        setCurrentWeek(previousWeekContainer);

        console.log('scrolling to week')

        previousWeekContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        previousWeekContainer.focus(); // Set focus to the week container
    }
});

// Event handler for next week button click
nextWeekButton.addEventListener('click', function () {
    var nextWeekContainer = currentWeekContainer.nextElementSibling;
    if (nextWeekContainer) {
        setCurrentWeek(nextWeekContainer);

        // update container widths
        updateContainerWidths();

        nextWeekContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nextWeekContainer.focus(); // Set focus to the week container
    } else {
        var nextWeekStartDate = new Date(currentWeekContainer.dataset.startDate);
        nextWeekStartDate.setDate(new Date(nextWeekStartDate).getDate() + 8); // overload to get Monday
        console.log(nextWeekStartDate);

        var week = getWeekObject(nextWeekStartDate);
        nextWeekContainer = renderWeek(week);

        // update container widths
        updateContainerWidths();
        setCurrentWeek(nextWeekContainer);

        nextWeekContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nextWeekContainer.focus(); // Set focus to the week container
    }
});

// Call the function when the window is resized
window.addEventListener('resize', updateContainerWidths);

// function to update the container widths
function updateContainerWidths() {
    const weekContainers = document.querySelectorAll('.week-container');
    weekContainers.forEach((weekContainer) => {
        const weekContainerWidth = window.innerWidth;
        weekContainer.style.width = `${weekContainerWidth}px`;

        const dayContainers = weekContainer.querySelectorAll('.day-container');
        const dayContainerWidth = weekContainerWidth / 7;
        dayContainers.forEach((dayContainer) => {
            dayContainer.style.width = `${dayContainerWidth}px`;
        });
    });
}

// Function to set the current week
function setCurrentWeek(weekContainer) {
    // Set the current week container
    currentWeekContainer = weekContainer;

    // Remove the focus class from the previously focused week container
    if (currentWeekContainer) {
        currentWeekContainer.classList.remove('focused');
    }

    // Add the focus class to the newly focused week container
    currentWeekContainer.classList.add('focused');
}