const { ipcRenderer } = require("electron");

// Add Event Listener
const partNumberInput = document.getElementById("partNumberInput");

partNumberInput.addEventListener("keyup", function (event) {
    handlePartNumberInput(event);
});

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    ipcRenderer.invoke('dark-mode:toggle')
});

// Event listener for process items
var processNameInput = document.querySelector(".process-name-input");
var processTimeInput = document.querySelector(".process-time-input");

processNameInput.addEventListener("keydown", addProcessInput);
processTimeInput.addEventListener("keydown", addProcessInput);

function addProcessInput(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        var processList = document.getElementById("processInputContainer");
        var processInput = document.createElement("div");
        processInput.className = "process-item";
        var processFields = document.createElement("div");
        processFields.className = "process-fields";
        var processNameInput = document.createElement("input");
        processNameInput.setAttribute("type", "text");
        processNameInput.setAttribute("class", "process-name-input");
        processNameInput.setAttribute("placeholder", "Process Name");
        var processTimeInput = document.createElement("input");
        processTimeInput.setAttribute("type", "number");
        processTimeInput.setAttribute("class", "process-time-input");
        processTimeInput.setAttribute("placeholder", "Time (in minutes)");

        // Create a small delete button
        var deleteButton = document.createElement("button");
        deleteButton.className = "process-delete-button";
        deleteButton.innerText = "x";
        deleteButton.addEventListener("click", function () {
            processList.removeChild(processInput);
        });

        // Add event listeners
        processNameInput.addEventListener("keydown", addProcessInput);
        processTimeInput.addEventListener("keydown", addProcessInput);

        // Append to the form
        processFields.appendChild(processNameInput);
        processFields.appendChild(processTimeInput);
        processInput.appendChild(processFields);
        processInput.appendChild(deleteButton);
        processList.appendChild(processInput);

        // Clear the values of the new inputs
        processNameInput.value = "";
        processTimeInput.value = "";

        // Add event listeners to prevent form submission on Enter key press
        processNameInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });

        processTimeInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });
    }
}

// Function to handle input event on part number field
function handlePartNumberInput(event) {
    const input = event.target.value.trim();

    // Only perform autocomplete if the input is not empty
    if (input !== "") {
        // Get all part IDs from storage
        let matchingParts = ipcRenderer.sendSync('get-parts', input);

        // Show the autocomplete suggestions
        if (matchingParts !== null) {
            showAutocompleteSuggestions(matchingParts);
        }
    } else {
        // Clear autocomplete suggestions if the input is empty
        clearDropdownBox();
    }
}

// Autocomplete function for part number input
function showAutocompleteSuggestions(matchingParts) {
    var dropdownContainer = document.getElementById("dropdownContainer");

    // Create a dropdown container if it doesn't exist
    if (!dropdownContainer) {
        dropdownContainer = document.createElement("div");
        dropdownContainer.setAttribute("class", "autocomplete-container");
        dropdownContainer.setAttribute("id", "dropdownContainer");

        // Position the dropdown container below the partNumberInput field
        const partNumberInput = document.getElementById("partNumberInput");
        const inputRect = partNumberInput.getBoundingClientRect();
        dropdownContainer.style.left = inputRect.left + "px";
        dropdownContainer.style.top = inputRect.bottom + "px";
        dropdownContainer.style.width = '300px';

        // Append the dropdown container to the parent container
        document.body.appendChild(dropdownContainer);
    }

    // Add a click event listener to the document to close the dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!dropdownContainer.contains(event.target) && event.target !== partNumberInput) {
            clearDropdownBox();
        }
    });

    // Clear the previous suggestions
    dropdownContainer.innerHTML = "";

    // Set the font size of the suggestion items to match the input field
    const inputFontSize = window.getComputedStyle(partNumberInput).getPropertyValue("font-size");

    // Create and append suggestion items to the dropdown container
    matchingParts.forEach((part) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = part.name;
        suggestionItem.style.cursor = "pointer";
        suggestionItem.style.fontSize = inputFontSize; // Set the font size
        suggestionItem.style.width = '300px';
        // Add click event listener to handle selection
        suggestionItem.addEventListener("click", () => {
            selectSuggestion(part);
        });

        dropdownContainer.appendChild(suggestionItem);
    });
}

// Function to handle selection of a suggestion
function selectSuggestion(part) {
    // Set the selected suggestion as the value of the part number input field
    partNumberInput.value = part.name;

    // Clear the dropdown container
    clearDropdownBox();

    // Update the process fields
    var processName = document.getElementById("processNameInput");
    var processTime = document.getElementById("processTimeInput");

    processName.value = part.processes[0].name;
    processTime.value = part.processes[0].time;
    part.processes.shift();

    if (part.processes.length > 0) {
        part.processes.forEach((process) => {
            var processList = document.getElementById("processInputContainer");
            var processInput = document.createElement("div");
            processInput.className = "process-item";
            var processFields = document.createElement("div");
            processFields.className = "process-fields";
            var processNameInput = document.createElement("input");
            processNameInput.setAttribute("type", "text");
            processNameInput.setAttribute("class", "process-name-input");
            processNameInput.setAttribute("placeholder", "Process Name");
            var processTimeInput = document.createElement("input");
            processTimeInput.setAttribute("type", "number");
            processTimeInput.setAttribute("class", "process-time-input");
            processTimeInput.setAttribute("placeholder", "Time (in minutes)");

            // Create a small delete button
            var deleteButton = document.createElement("button");
            deleteButton.className = "process-delete-button";
            deleteButton.innerText = "x";
            deleteButton.addEventListener("click", function () {
                processList.removeChild(processInput);
            });

            // Add event listeners
            processNameInput.addEventListener("keydown", addProcessInput);
            processTimeInput.addEventListener("keydown", addProcessInput);

            // Append to the form
            processFields.appendChild(processNameInput);
            processFields.appendChild(processTimeInput);
            processInput.appendChild(processFields);
            processInput.appendChild(deleteButton);
            processList.appendChild(processInput);

            // Clear the values of the new inputs
            processNameInput.value = process.name;
            processTimeInput.value = process.time;

            // Add event listeners to prevent form submission on Enter key press
            processNameInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            });

            processTimeInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            });
        })
    }
}

// Function to clear the dropdown box
function clearDropdownBox() {
    const dropdownBox = document.getElementById("dropdownContainer");
    if (dropdownBox) {
        dropdownBox.remove();
    }
}