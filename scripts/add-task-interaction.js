function start() {
  fetchContacts();
  initPriorityButtons();
  renderTopBar();
}

/**
 * Handles the click event on a priority button.
 * It resets the state of all priority buttons, then highlights the clicked button.
 *
 * @param {HTMLElement} clickedButton - The priority button that was clicked.
 */
function handlePriorityClick(clickedButton) {
  document.querySelectorAll(".priority button").forEach(resetButtonState);
  highlightButton(clickedButton);
}

/**
 * Initializes the priority buttons by adding click event listeners to each button.
 * When a button is clicked, it triggers the handlePriorityClick function.
 * If no priority is provided, the default medium priority button is selected.
 * If an invalid priority is provided, a warning is logged and the default medium priority button is selected.
 *
 * @param {string} [priority] - The priority to be set initially. Can be 'low', 'medium', or 'high'.
 */
function initPriorityButtons(priority) {
  const priorityButtons = document.querySelectorAll(".priority button");

  priorityButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      handlePriorityClick(button);
    });
  });

  const defaultMediumButton = document.querySelector(".priority .medium");
  if (!priority) {
    handlePriorityClick(defaultMediumButton);
  } else {
    const priorityButton = document.querySelector(`.priority .${priority}`);
    if (priorityButton) {
      handlePriorityClick(priorityButton);
    } else {
      handlePriorityClick(defaultMediumButton);
    }
  }
}

/**
 * Resets the state of a button by changing its background color, text color, 
 * and the fill color of any SVG paths within the button based on its priority class.
 *
 * @param {HTMLElement} button - The button element to reset.
 */
function resetButtonState(button) {
  button.style.backgroundColor = "#FFFFFF";
  button.style.color = "black";
  const priorityColors = {
    urgent: "#FF3D00",
    medium: "#FFA800",
    low: "#7AE229",
  };
  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach((path) => {
    path.style.fill = priorityColors[button.classList[0]];
  });
}

/**
 * Highlights a button by changing its background color and text color based on its priority class.
 * The priority class should be one of "urgent", "medium", or "low".
 * Also changes the fill color of any SVG paths within the button to white.
 *
 * @param {HTMLElement} button - The button element to be highlighted. 
 */
function highlightButton(button) {
  const priorityColors = {
    urgent: "#FF3D00",
    medium: "#FFA800",
    low: "#7AE229",
  };
  button.style.backgroundColor = priorityColors[button.classList[0]];
  button.style.color = "white";
  const svgPaths = button.querySelectorAll("svg path");
  svgPaths.forEach((path) => {
    path.style.fill = "white";
  });
}

// open Calendar
function openDatePicker() {
  let dateInput = document.getElementById("due-date");
  if (dateInput) {
    dateInput.showPicker();
  }
}


/**
 * Opens the edit task modal and populates it with the provided task details.
 *
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} DueDate - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {string} id - The unique identifier of the task.
 */
function openEditTask(category, title, description, DueDate, priority, id) {
  const editTaskContainer = document.getElementById("modalAddTask");
  if (editTaskContainer) {
    editTaskContainer.innerHTML = addEditTask(category, title, description, DueDate, priority, id);
  }
}




function addSubtask() {
  let subTaskInputRef = document.getElementById("new-subtask-input");
  let subTaskContainer = document.getElementById("subtasks-container");

  if (subTaskInputRef && subTaskContainer) {
    let subTaskInput = subTaskInputRef.value.trim();
    if (!subTaskInput) return;

    subTaskCount += 1;
    subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, subTaskCount);
    subTaskInputRef.value = "";
    resetButtonAddTask();
  }
}

function clearForm() {
  let inputField = document.getElementById("new-subtask-input");
  if (inputField) {
    inputField.value = "";
    resetButtonAddTask();
  }
}

/**
 * Transforms the "Add Task" button by replacing its outer HTML with a new button.
 */
function transformButtonAddTask() {
  const buttonContainer = document.getElementById("iconAddButton");
  if (buttonContainer) {
    buttonContainer.outerHTML = getTransformedButton();
  }
}

/**
 * Resets the "Add Task" button.
 */
function resetButtonAddTask() {
  const inputWrapper = document.getElementById("inputWrapper");
  if (inputWrapper) {
    inputWrapper.innerHTML = transformedResetButton();
  }
}

/**
 * Handles the click event for adding a task.
 */
function handleButtonClickAddTask(event) {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonAddTask();
  } else {
    addSubtask();
  }
}
