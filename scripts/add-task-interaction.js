
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
      console.warn("Invalid priority, falling back to default.");
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
 * @param {HTMLElement} button - The button element to be highlighted. The button should have a class
 *                               indicating its priority ("urgent", "medium", or "low").
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


function start() {
  fetchContacts();
  initPriorityButtons();
  renderTopBar();
}

// open Calendar
function openDatePicker() {
  let dateInput = document.getElementById("due-date");
  dateInput.showPicker();
}

/**
 * Öffnet das Bearbeitungsfenster für eine Aufgabe und füllt es mit den gegebenen Informationen.
 *
 * category - Die Kategorie der Aufgabe.
 *  title - Der Titel der Aufgabe.
 *  description - Die Beschreibung der Aufgabe.
 *  DueDate - Das Fälligkeitsdatum der Aufgabe.
 *  priority - Die Priorität der Aufgabe.
 *  id - Die eindeutige ID der Aufgabe.
 */
function openEditTask(category, title, description, DueDate, priority, id) {
  const editTaskContainer = document.getElementById("modalAddTask");
  editTaskContainer.innerHTML = "";
  editTaskContainer.innerHTML = addEditTask(category, title, description, DueDate, priority, id);
}


/**
 * Adds a new subtask to the subtask container.
 * 
 * This function retrieves the input value from the subtask input field,
 * trims any leading or trailing whitespace, and if the input is not empty,
 * it increments the subtask count and appends a new subtask to the subtask container.
 * The input field is then cleared, and the add task button is reset.
 * 
 * @function addSubtask
 * @returns {void}
 */
function addSubtask() {
  let subTaskInputRef = document.getElementById("new-subtask-input");
  let subTaskInput = subTaskInputRef.value.trim();
  let subTaskContainer = document.getElementById("subtasks-container");
  if (!subTaskInput) {
    return;
  }
  if (!subTaskCount) {
    subTaskCount = 0;
  }
  subTaskCount += 1;
  subTaskContainer.innerHTML += addSubtaskTemplate(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
  resetButtonAddTask();
}


function clearForm() {
  document.getElementById("new-subtask-input").value = "";
  resetButtonAddTask();
}

/**
 * Transforms the "Add Task" button by replacing its outer HTML with a new button.
 * 
 * This function searches for an element with the ID "iconAddButton". If the element
 * is found, it replaces the element's outer HTML with the result of the `getTransformedButton` function.
 * If the element is not found, the function exits without making any changes.
 */
function transformButtonAddTask() {
  const buttonContainer = document.getElementById("iconAddButton");
  if (!buttonContainer) {
    return;
  }
  buttonContainer.outerHTML = getTransformedButton();
}

/**
 * Resets the "Add Task" button by updating the inner HTML of the input wrapper element.
 * This function retrieves the element with the ID "inputWrapper" and sets its inner HTML
 * to the result of the `transformedResetButton` function, effectively resetting the button.
 */
function resetButtonAddTask() {
  const inputWrapper = document.getElementById("inputWrapper");
  inputWrapper.innerHTML = transformedResetButton();
}

/**
 * Handles the click event for adding a task.
 * 
 * This function checks the type of input device used for the event (mouse, touch, or pen).
 * If the event is triggered by one of these devices, it resets the add task button.
 * Otherwise, it adds a subtask.
 * 
 * @param {Event} event - The event object representing the click event.
 */
function handleButtonClickAddTask() {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonAddTask();
  } else {
    addSubtask();
  }
}
