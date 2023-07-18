const { ipcRenderer } = require('electron');
const addRemoveObject = require('../app/addRemoveObject')

// variables
const weeksContainer = document.getElementById('weeks-container');
var sendingContainer;
var isAddPartFormVisible;
var currentDay;

function renderWeek(week) {
    try {
        // Set the current week
        currentWeek = new Date(week.startDate);

        // Create the week container
        const weekContainer = document.createElement('div');
        weekContainer.id = week.id;
        weekContainer.classList.add('week-container');
        weekContainer.dataset.startDate = week.startDate;

        // Create and append the week start and end day label
        const startDateLabel = document.createElement('div');
        startDateLabel.classList.add('startDate-container');
        startDateLabel.textContent = formatDate(week.startDate) + ' - ' + formatDate(getEndDate(week.startDate));
        weekContainer.appendChild(startDateLabel);

        // Create a container for the day containers
        const daysContainer = document.createElement('div');
        daysContainer.classList.add('days-container');

        // Iterate over the fetched days
        week.days.forEach((day) => {
            const dayContainer = renderDay(day); // Create a new day container for each day
            daysContainer.appendChild(dayContainer); // Append the day container to the week container

            if (day.jobs !== null) {
                day.jobs.forEach((job) => {
                    const jobButton = renderJob(job);
                    dayContainer.partContainer.appendChild(jobButton); // Append the part button to the day's part container
                });
            }
            // Calculate the total hours
            calculateTotalHours(dayContainer);
        });

        // Append the day container to the week container
        weekContainer.appendChild(daysContainer);

        // Determine the index to insert the week container
        const weekContainers = Array.from(weeksContainer.getElementsByClassName('week-container'));
        const insertIndex = weekContainers.findIndex((container) => {
            const containerStartDate = new Date(container.dataset.startDate);
            return containerStartDate > currentWeek;
        });

        // Insert the week container at the appropriate position
        if (insertIndex === -1) {
            weeksContainer.appendChild(weekContainer); // Append at the end if insertIndex is -1 or if it's the next week
        } else {
            weeksContainer.insertBefore(weekContainer, weekContainers[insertIndex]); // Insert at the determined index
        }

        return weekContainer;
    } catch (error) {
        console.error('Error rendering week: ', error);
    }
}

// Helper function to format the date
function formatDate(date) {
    date = new Date(date);
    console.log(date)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${month} ${day}`;
}

// Helper function to get the end date of the week
function getEndDate(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return endDate;
}

function renderDay(day) {
    try {
        // Create the day container
        var dayContainer = document.createElement("div");
        dayContainer.className = "day-container";

        // Create the day label
        var dayLabel = document.createElement("div");
        dayLabel.className = "day-label";
        dayLabel.innerText = day.name;

        // Create the part container
        var partContainer = document.createElement("div");
        partContainer.className = "part-container";
        partContainer.id = day.id;

        // Add event listener for draggable buttons
        partContainer.addEventListener("dragover", (event) => {
            event.preventDefault();
            // Add the 'drag-over' class to the part container
            partContainer.classList.add("drag-over");
        });

        partContainer.addEventListener("dragleave", function (event) {
            // Remove the 'drag-over' class from the part container
            partContainer.classList.remove("drag-over");
        });

        partContainer.addEventListener("drop", (event) => {
            event.preventDefault();
            const jobId = event.dataTransfer.getData("text/plain");

            // Get the dragged button element
            const draggedButton = document.getElementById(jobId);
            const sendingDayId = draggedButton.parentNode.id;

            console.log("From catcher: ")
            console.log("Job has id: " + jobId + " and is being sent from day id: " + sendingDayId)
            const targetDayId = event.target.id;

            // Append the dragged button to the target container
            event.target.appendChild(draggedButton);

            // Remove the 'drag-over' class from the part container
            partContainer.classList.remove("drag-over");

            // Update the day to include the button
            addRemoveObject.getJobObject(jobId, targetDayId);

            // calculate time
            calculateTotalHours(partContainer.parentNode)

            // recalculate the total hours in the sending container
            sendingContainer = document.getElementById(sendingDayId)
            calculateTotalHours(sendingContainer.parentNode)
        });

        // Set the reference to the part container on the day container
        dayContainer.partContainer = partContainer;

        // Create the capacity container
        var capacityContainer = renderCapacity();
        dayContainer.capacityContainer = capacityContainer;

        // recalculate hours after keydown event
        // var capacityInput = document.getElementById('capacityInput')
        // capacityInput.addEventListener('keydown', () => {
        //     calculateTotalHours(dayContainer)
        // });

        // Create an add new part button
        var addPartContainer = document.createElement("div");
        addPartContainer.className = "addPart-container";

        var partButton = document.createElement("a");
        partButton.className = "mini-listing gray button";
        partButton.innerText = "+";
        partButton.addEventListener("click", function () {
            openAddPartForm(day);
        })

        addPartContainer.appendChild(partButton);

        // Append the elements to the day container
        dayContainer.appendChild(dayLabel);
        dayContainer.appendChild(partContainer);
        dayContainer.appendChild(capacityContainer);
        partContainer.appendChild(addPartContainer);

        return dayContainer;
    } catch (error) {
        console.error('Error rendering day: ', error);
    }
}

// get the buttons
const submitButton = document.getElementById('addPartSubmitButton')
const closeButton = document.getElementById('addPartCloseButton')

// get the drag handle element
const dragHandle = document.querySelector('.drag-handle');
const addPartForm = document.getElementById('add-part-form');

// variables to store the initial position and mouse offset
let initialX;
let initialY;
let offsetX;
let offsetY;

// function to handle the mousedown event on the drag handle
function dragMouseDown(event) {
    event.preventDefault();
    initialX = event.clientX;
    initialY = event.clientY;
    offsetX = initialX - addPartForm.offsetLeft;
    offsetY = initialY - addPartForm.offsetTop;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopDragging);
}

// function to handle the mousemove event while dragging
function elementDrag(event) {
    event.preventDefault();
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    addPartForm.style.left = x + 'px';
    addPartForm.style.top = y + 'px';
}

// Function to stop dragging
function stopDragging() {
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', stopDragging);
}

// Attach the mousedown event listener to the drag handle
dragHandle.addEventListener('mousedown', dragMouseDown);

submitButton.addEventListener('click', (event) => {
    submitForm(event);
});

closeButton.addEventListener('click', (event) => {
    closeAddPartForm(event);
});

function openAddPartForm(day) {
    if (!isAddPartFormVisible) {
        currentDay = day;
        addPartForm.style.display = "block";
        isAddPartFormVisible = true;
    }
}

function closeAddPartForm() {
    if (isAddPartFormVisible) {
        // Clear the form fields
        var workOrderInput = document.getElementById("workOrderInput");
        var partNumberInput = document.getElementById("partNumberInput");
        workOrderInput.value = "";
        partNumberInput.value = "";

        // Clear extra process items and form fields
        var processList = document.getElementById("processInputContainer");
        var processItems = processList.getElementsByClassName("process-item");
        for (var i = 1; i < processItems.length; i++) {
            processList.removeChild(processItems[i]);
        }
        addPartForm.style.display = "none";
        isAddPartFormVisible = false;

        var processNameInput = document.getElementById("processNameInput");
        var processTimeInput = document.getElementById("processTimeInput");
        processNameInput.value = "";
        processTimeInput.value = "";
    }
}

function submitForm(event) {
    try {
        event.preventDefault();

        // get the input values
        var workOrder = document.getElementById("workOrderInput").value;
        var partName = document.getElementById("partNumberInput").value;
        var processes = getProcesses();

        // create a new part object
        var part = addRemoveObject.getPartObject(partName, processes);

        // create a new job object
        var job = ipcRenderer.sendSync('create-job-object', currentDay.date, workOrder, part);

        // update the job day
        var job = addRemoveObject.getJobObject(job, currentDay);

        // render the job
        var renderedJob = renderJob(job);

        // add the job to the correct part container
        var partContainer = document.getElementById(currentDay.id);
        partContainer.appendChild(renderedJob);

        // close the form
        closeAddPartForm();

        // calculate the total hours in the part container
        calculateTotalHours(partContainer.parentNode);
    }
    catch (error) {
        console.error("Error submitting form: ", error);
    }
}

function getProcesses() {
    var processItems = document.getElementsByClassName("process-item");
    var processes = [];

    for (var i = 0; i < processItems.length; i++) {
        var processName = processItems[i].querySelector(".process-name-input").value;
        var processTime = processItems[i].querySelector(".process-time-input").value;

        if (processName !== "" && processTime !== "") {
            var process = ipcRenderer.sendSync('create-process-object', processName, processTime);
            processes.push(process);
        }
    }

    return processes;
}

// Function to create the capacity container
function renderCapacity() {
    try {
        const capacityContainer = document.createElement("div");
        capacityContainer.classList.add("capacity-container");

        // Create a div to hold the label and input for Capacity
        const capacityDiv = document.createElement("div");
        capacityDiv.classList.add("capacity-input-container");
        capacityContainer.capacityDiv = capacityDiv;

        // Create the label element for Capacity
        const capacityLabel = document.createElement("label");
        capacityLabel.setAttribute("for", "capacityInput");
        capacityLabel.textContent = "Capacity: ";
        capacityLabel.style.display = "inline-block"; // Display inline

        // Create the input element for Capacity
        const input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("id", "capacityInput");
        input.setAttribute("min", "0");
        input.setAttribute("step", "0.5");
        input.setAttribute("value", "8");
        input.setAttribute("data-day-container-id", "day-container-id");
        capacityDiv.input = input;

        // Append the label and input to the capacity div
        capacityDiv.appendChild(capacityLabel);
        capacityDiv.appendChild(input);

        // Create a div to hold the label and input for hours
        const hoursDiv = document.createElement("div");
        hoursDiv.classList.add("hours-container");

        // Create the label element for Hours
        const hoursLabel = document.createElement("label");
        hoursLabel.setAttribute("for", "total-hours");
        hoursLabel.textContent = "Hours:";
        hoursLabel.style.display = "inline-block"; // Display inline

        // Create the span element for total hours
        const totalHoursSpan = document.createElement("span");
        totalHoursSpan.className = "total-hours";
        totalHoursSpan.textContent = "0";

        // Append the label and input to the capacity div
        hoursDiv.appendChild(hoursLabel);
        hoursDiv.appendChild(totalHoursSpan);

        // Create the span element for the capacity report
        const reportSpan = document.createElement("span");
        reportSpan.className = "report-span";
        reportSpan.textContent = "0";
        capacityDiv.reportSpan = reportSpan;

        // Append the capacity div, hours label, and total hours span to the capacity container
        capacityContainer.appendChild(capacityDiv);
        capacityContainer.appendChild(hoursDiv);
        capacityContainer.appendChild(reportSpan);

        return capacityContainer;
    }
    catch (error) {
        console.error('Error rendering capacity: ', error);
    }
}

// Function to calculate the total hours
function calculateTotalHours(dayContainer) {
    var partContainerId = dayContainer.partContainer.id;
    var parts = addRemoveObject.getAllJobs(partContainerId);
    let totalHours = 0;

    if (parts) {
        for (const part of parts) {
            var processes = part.processes;

            processes.forEach((process) => {
                var time = parseInt(process.time);
                if (!isNaN(time)) {
                    totalHours += time / 60;
                }
            });
        }
    }

    // Check to see if it is greater than or less than the totalHours
    checkCapacity(totalHours, dayContainer);

    // Convert total hours to two decimal places
    var finalTime = parseFloat(totalHours.toFixed(2));

    // Update the capacity value
    const totalHoursValue = dayContainer.querySelector(".total-hours");
    totalHoursValue.textContent = finalTime;
}

function checkCapacity(totalHours, dayContainer) {
    const capacity = dayContainer.capacityContainer.capacityDiv.input.value;
    const capacityDiv = dayContainer.capacityContainer.capacityDiv;
    var diff = capacity - totalHours;
    diff = parseFloat(diff.toFixed(2));
    capacityDiv.reportSpan.textContent = diff + ' hr.';

    if (!isNaN(totalHours) && !isNaN(capacity)) {
        if (totalHours > capacity) {
            capacityDiv.reportSpan.style.color = "#FF0000";
            dayContainer.partContainer.classList.add("highlight");
        } else {
            capacityDiv.reportSpan.style.color = "#00FF00";
            dayContainer.partContainer.classList.remove("highlight");
        }
    }
}

// Define an array of colors
var colors = [
    "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF",
    "#FFA500", "#008080", "#FF1493", "#8A2BE2", "#3CB371",
    "#FF6347", "#00CED1", "#FF4500", "#20B2AA", "#FFC0CB",
    "#ADFF2F", "#00BFFF", "#FF69B4", "#1E90FF", "#FFD700",
    "#9932CC", "#6A5ACD", "#00FA9A", "#FF7F50", "#32CD32",
    "#4169E1", "#FF8C00", "#00FF7F", "#FF00FF", "#FFA07A",
    "#48D1CC", "#BA55D3", "#1A90D3", "#8FBC8F", "#FA8072",
    "#87CEEB", "#9370DB", "#2E8B57", "#FFD700", "#6B8E23",
    "#00FFFF", "#FF6347", "#2F4F4F", "#00FF7F", "#FF00FF",
    "#87CEFA", "#EE82EE", "#00FA9A", "#D2691E", "#008080",
    "#20B2AA", "#B8860B", "#00FFFF", "#556B2F", "#696969"
];

// Store the assigned color for each work order
var workOrderColors = {};

function renderJob(job) {
    try {
        var newButton = document.createElement("button");
        newButton.id = job.id;

        newButton.className = "dynamic-button";
        newButton.draggable = "true";

        var buttonContent = document.createElement("div");
        buttonContent.className = "button-content";

        var workOrderSpan = document.createElement("span");
        workOrderSpan.className = "work-order";
        workOrderSpan.innerText = "WO: " + job.workOrder;

        var partNumberSpan = document.createElement("span");
        partNumberSpan.className = "part-number";
        partNumberSpan.innerText = "\nPart: " + job.part.name;

        buttonContent.appendChild(workOrderSpan);
        buttonContent.appendChild(partNumberSpan);

        var processContent = document.createElement("div");
        processContent.className = "process-content";

        job.part.processes.forEach((process) => {
            var processInfo = document.createElement("div");
            processInfo.className = "process-info";
            processInfo.innerText = process.name + " (" + process.time + " mins)";
            processContent.appendChild(processInfo);
        });

        buttonContent.appendChild(processContent);
        newButton.appendChild(buttonContent);

        newButton.addEventListener("dragstart", function (event) {
            // Set the sending container
            var jobId = event.target.id;
            var sendingDayId = newButton.parentNode.id;
            console.log('From sender: ')
            console.log("Job has id: " + jobId + " and is being sent from day id: " + sendingDayId)
            console.log(" ")

            event.dataTransfer.setData('text/plain', jobId, sendingDayId);
        });

        newButton.addEventListener("dblclick", function (event) {
            toggleProcessContent(event);
        });

        function toggleProcessContent(event) {
            var button = event.target.closest(".dynamic-button");
            button.classList.toggle("expanded");
        }

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'x';
        deleteButton.classList.add('delete-button');
        newButton.appendChild(deleteButton);

        // Add event listener for delete button click
        deleteButton.addEventListener('click', async function (event) {
            const deleteButton = event.target;
            const partButton = deleteButton.parentNode;
            const partContainer = partButton.parentNode;
            partContainer.removeChild(partButton);

            // remove from container
            addRemoveObject.deleteJob(partButton.id);
            partButton.remove();
            calculateTotalHours(partContainer.parentNode);
        });

        // Assign a color to the work order
        if (!workOrderColors.hasOwnProperty(job.workOrder)) {
            // Assign a color from the available colors array
            var color = colors.shift();
            workOrderColors[job.workOrder] = color;
            // Move the used color to the end of the array to ensure a good distribution of colors
            colors.push(color);
        }

        newButton.style.backgroundColor = workOrderColors[job.workOrder];
        return newButton;
    } catch (error) {
        console.error("Error rendering job: ", error);

    }
}

module.exports = {
    renderWeek,
    calculateTotalHours
};