function start() {
  fetchContacts();
  initPriorityButtons();
  renderTopBar();
}

let normalSubtaskCount = 0;
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

/**
 * Opens the date picker for the input element with the ID "due-date".
 * Ensures that the minimum date is set before displaying the picker.
 * If the input element is not found, the function does nothing.
 */
function openDatePicker() {
  setMinDate();
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

/**
 * Adds a new subtask to the subtask container.
 * 
 * This function retrieves the input value from the subtask input field, validates it,
 * and appends a new subtask to the subtask container using a template. It also resets
 * the input field and updates the task button state.
 * 
 * @returns {void} This function does not return a value.
 */
function addSubtask() {
  let subTaskInputRef = document.getElementById("new-subtask-input");
  let subTaskContainer = document.getElementById("subtasks-container");
  if (subTaskInputRef && subTaskContainer) {
    let subTaskInput = subTaskInputRef.value.trim();
    if (!subTaskInput) {
      return;
    }
    normalSubtaskCount += 1;
    subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, normalSubtaskCount);
    subTaskInputRef.value = "";
    resetButtonAddTask(normalSubtaskCount);
  }
}

/**
 * Transforms the "Add Task" button by replacing its outer HTML with a new button structure.
 * 
 * This function locates the button container element with the ID "iconAddButton" and, if found,
 * replaces its outer HTML with the result of the `getTransformedButton` function. 
 * 
 * Note: Ensure that the `getTransformedButton` function is defined and returns the desired HTML structure.
 */
function transformButtonAddTask() {
  const buttonContainer = document.getElementById("iconAddButton");
  if (buttonContainer) {
    buttonContainer.outerHTML = getTransformedButton();
  }
}

/**
 * Resets the "Add Task" button by updating the inner HTML of the input wrapper element.
 *
 * @param {number} normalSubtaskCount - The number of normal subtasks to be used in the reset process.
 * @returns {void}
 */
function resetButtonAddTask(normalSubtaskCount) {
  const inputWrapper = document.getElementById("inputWrapper");
  if (inputWrapper) {
    inputWrapper.innerHTML = transformedResetButtonAddTask(normalSubtaskCount);
  }
}

/**
 * Handles the click event for the "Add Task" button.
 * Depending on the type of input device used, it either resets the button
 * or adds a subtask.
 *
 * @param {PointerEvent} event - The pointer event triggered by the button click.
 * @property {string} event.pointerType - The type of input device used (e.g., "mouse", "touch", "pen").
 */
function handleButtonClickAddTask(event) {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonAddTask();
  } else {
    addSubtask();
  }
}

/**
 * Deletes a subtask element from the DOM in the "Add Task" interface.
 *
 * @param {number|string} id - The unique identifier of the subtask to be removed.
 *                             This ID is used to locate the subtask element in the DOM.
 */
function deleteSubtaskAddTask(id) {
  const removeSubtask = document.getElementById(`subTaskUnit${id}`);
  removeSubtask.remove();
}

/**
 * Handles the addition of a new subtask to the task list. 
 * If the input for the subtask is empty, it removes the subtask input field.
 * Otherwise, it adds the subtask to the container and removes the input field.
 *
 * @param {number} id - The unique identifier for the subtask input field and related elements.
 */
function acceptAddTask(id) {
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;
  if (!newSubTask) {
    deleteSubtaskAddTask(id);
    return;
  }
  const subTaskContainer = document.getElementById("subtasks-container");
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
  subTaskContainer.innerHTML += addSubtaskTemplate(newSubTask, id);
}
