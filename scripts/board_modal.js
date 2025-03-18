/**
 * The above functions are used to toggle the display of a status menu and change the visibility of
 * arrow icons based on the menu state.
 * @param event - The `event` parameter in your functions represents the event object that is passed
 * when the event is triggered, such as a click event. This object contains information about the
 * event, such as the type of event, the target element, and any additional data related to the event.
 * You can use this parameter
 * @param id - The `id` parameter in the `openStatusNav` and `closeStatusNav` functions is used to
 * identify the specific element that should be manipulated when the functions are called.
 */

function openStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "block";
  document.getElementById(`arrowDown${id}`).style.display = "none";
  document.getElementById(`arrowUp${id}`).style.display = "block";
}

/**
 * Closes the status navigation menu for a specific element and updates the visibility of associated arrows.
 *
 * @param {Event} event - The event object to stop propagation.
 * @param {string|number} id - The unique identifier for the status menu and arrow elements.
 */
function closeStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "none";
  document.getElementById(`arrowDown${id}`).style.display = "block";
  document.getElementById(`arrowUp${id}`).style.display = "none";
}

/**
 * The above JavaScript functions handle opening a modal, loading task summary content, rendering task
 * details, managing task visibility, assigning contacts, handling subtasks, and updating subtask
 * statuses.
 * @param id - The `id` parameter in the `openModal(id)` functions is used to
 * identify the specific task which information should be rendered in the modal.
 */
function openModal(id) {
  loadTaskSummaryModal(id)
    .then(() => {
      var modal = document.getElementById("modalTaskSummary");
      var backdrop = document.getElementById("taskSummaryModal");

      backdrop.style.visibility = "visible";
      backdrop.style.opacity = "1";

      modal.style.visibility = "visible";
      type = "button";
      modal.classList.remove("hide");
      modal.classList.add("show");
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

/**
 * Loads and displays the task summary modal for a specific task.
 *
 * @param {number|string} id - The unique identifier of the task to be displayed.
 * @returns {Promise<void>} A promise that resolves when the modal content is loaded successfully,
 *                          or rejects with an error message if the task is not found.
 *
 * @throws {Error} If the task with the specified ID is not found.
 *
 * @example
 * loadTaskSummaryModal(1)
 *   .then(() => {
 *     console.log("Task summary modal loaded successfully.");
 *   })
 *   .catch((error) => {
 *     console.error("Error loading task summary modal:", error);
 *   });
 */
function loadTaskSummaryModal(id) {
  return new Promise((resolve, reject) => {
    let summaryModal = document.getElementById("taskSummaryModal");
    summaryModal.innerHTML = "";

    let task = allTasks.find((t) => t.id === id);
    if (!task) return reject("Task not found");

    renderTaskSummaryContent(summaryModal, task);
    handleTaskVisibility(task);
    setTimeout(resolve, 0);
  });
}

/**
 * Renders the task summary content inside the provided modal element.
 *
 * @param {HTMLElement} summaryModal - The HTML element where the task summary will be rendered.
 * @param {Object} task - The task object containing details to be displayed in the summary.
 * @param {string} task.dueDate - The due date of the task in a specific format.
 * @param {string} task.priority - The priority level of the task (e.g., "High", "Medium", "Low").
 * @param {string} task.category - The category of the task used to determine its color.
 *
 * @returns {void} This function does not return a value. It updates the innerHTML of the summaryModal element.
 */
function renderTaskSummaryContent(summaryModal, task) {
  let formattedDate = convertTask(task.dueDate);
  let priority = determinePriotirySpan(task.priority);
  let priorityIcon = determinePriotiry(task.priority);
  let categoryColor = determineCategoryColor(task.category);
  summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formattedDate, categoryColor, priority);
}

/**
 * Converts a given date string into a formatted date string.
 *
 * @param {string} dueDate - The date string to be converted, in a format
 *                           that can be parsed by the JavaScript Date object.
 * @returns {string} The formatted date string in "en-GB" locale (e.g., "dd/mm/yyyy").
 */
function convertTask(dueDate) {
  let formatedDueDate = new Intl.DateTimeFormat("en-Gb").format(new Date(dueDate));
  return formatedDueDate;
}

/**
 * Determines the priority span based on the provided priority value.
 * If no priority is provided, it defaults to "medium".
 *
 * @param {string} [priority] - The priority level (e.g., "low", "medium", "high").
 * @returns {string} - The determined priority level, defaulting to "medium" if none is provided.
 */
function determinePriotirySpan(priority) {
  if (!priority) {
    priority = "medium";
  }
  return priority;
}

/**
 * Determines the background color style based on the given category.
 *
 * @param {string} category - The category name to determine the color for.
 * @returns {string} The CSS style string representing the background color.
 *                   Returns "background-color:rgba(31, 215, 193, 1);" for "Technical Task",
 *                   otherwise returns "background-color:rgba(0, 56, 255, 1);".
 */
function determineCategoryColor(category) {
  let categoryColor;
  if (category == "Technical Task") {
    categoryColor = "background-color:rgba(31, 215, 193, 1);";
    return categoryColor;
  } else {
    categoryColor = "background-color:rgba(0, 56, 255, 1);";
  }
  return categoryColor;
}

/**
 * Handles the visibility of task-related elements based on the task's properties.
 * If the task has assigned contacts, it injects the assignee contacts into the DOM.
 * Otherwise, it hides the assigned-to container for the task.
 * Similarly, if the task has subtasks, it injects the subtasks into the DOM.
 * Otherwise, it hides the subtask container for the task.
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {Array} [task.assignedTo] - An array of contacts assigned to the task.
 * @param {Array} [task.subtasks] - An array of subtasks associated with the task.
 * @param {string|number} task.id - The unique identifier of the task, used for DOM element targeting.
 */
function handleTaskVisibility(task) {
  task.assignedTo?.length ? injectAssigneeContacts(task) : hideElement(`assignedToContainer${task.id}`);
  task.subtasks?.length ? injectSubtasks(task) : hideElement(`subtaskContainer${task.id}`);
}

/**
 * Injects the assignee contacts into the modal for a specific task.
 *
 * This function dynamically updates the content of the assignee container
 * in the modal by clearing its current content and rendering the list of
 * assignees associated with the given task. Each assignee is displayed
 * with their corresponding color.
 *
 * @async
 * @function
 * @param {Object} task - The task object containing details about the task.
 * @param {number} task.id - The unique identifier of the task.
 * @param {Array<string>} task.assignedTo - An array of assignee names or identifiers.
 * @param {Array<string>} task.color - An array of color codes corresponding to each assignee.
 *
 * @throws {Error} Throws an error if the assignee container element is not found.
 */
async function injectAssigneeContacts(task) {
  const assigneeContainer = document.getElementById(`assigneeListModal${task.id}`);
  assigneeContainer.innerHTML = "";
  let assigneeList = extractAssigneeList(task.assignedTo);
  assigneeList.forEach((assignee, index) => renderAssignee(assignee, task.color[index], assigneeContainer));
}

/**
 * Hides an HTML element by setting its display style to "none".
 *
 * @param {string} id - The ID of the HTML element to hide.
 */
function hideElement(id) {
  let element = document.getElementById(id);
  if (element) element.style.display = "none";
}

/**
 * Extracts a list of assignees from the provided input.
 *
 * @param {Array|string|Object} assignedTo - The input representing the assignees.
 *   - If an array is provided, it is returned as is.
 *   - If a string is provided, it is wrapped in an array and returned.
 *   - If an object is provided, its keys are returned as an array.
 *   - For any other type, an empty array is returned.
 * @returns {Array} An array of assignees extracted from the input.
 */
function extractAssigneeList(assignedTo) {
  if (Array.isArray(assignedTo)) return assignedTo;
  if (typeof assignedTo === "string") return [assignedTo];
  if (typeof assignedTo === "object") return Object.keys(assignedTo);
  return [];
}

/**
 * Renders an assignee's information into a specified container element.
 *
 * @param {string} assignee - The name of the assignee. If not provided, defaults to "Unknown".
 * @param {string} color - The color associated with the assignee, used for styling.
 * @param {HTMLElement} container - The DOM element where the assignee's information will be rendered.
 */
function renderAssignee(assignee, color, container) {
  let name = assignee || "Unknown";
  let abbreviation = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  container.innerHTML += generateAssigneeComntacts(abbreviation, color, name);
}

/**
 * Asynchronously injects subtasks into the DOM for a given task.
 *
 * This function dynamically populates a container with subtasks associated with a task.
 * It ensures that the subtasks are displayed with their corresponding statuses and attaches
 * event listeners to the checkboxes for handling status changes.
 *
 * @async
 * @function injectSubtasks
 * @param {Object} task - The task object containing subtasks and their statuses.
 * @param {number|string} task.id - The unique identifier of the task.
 * @param {Array<string>} [task.subtasks] - An array of subtask descriptions. If not provided, defaults to an empty array.
 * @param {Array<number>} [task.subtasksStatus] - An array of subtask statuses (0 for incomplete, 1 for complete). If not provided, defaults to an array of 0s.
 *
 * @returns {Promise<void>} Resolves when the subtasks are successfully injected into the DOM.
 */
async function injectSubtasks(task) {
  const subtaskContainer = document.getElementById(`subtaskListModal${task.id}`);
  subtaskContainer.innerHTML = "";
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [task.subtasks || []];
  const statuses = Array.isArray(task.subtasksStatus) ? task.subtasksStatus : new Array(subtasks.length).fill(0);
  subtasks.forEach((subtask, index) => {
    subtaskContainer.innerHTML += generateSubtasks(task, subtask, index, statuses[index] === 1);
  });
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => cb.addEventListener("change", handleCheckboxChange));
}

/**
 * Handles the change event for a checkbox within a subtask container.
 * Updates the status of the subtasks based on their checked state,
 * stores the updated statuses, and reloads the board content.
 *
 * @param {Event} event - The event object triggered by the checkbox change.
 * @property {HTMLInputElement} event.target - The checkbox element that triggered the event.
 *
 * The function performs the following steps:
 * 1. Extracts the checkbox element and its associated task ID.
 * 2. Determines the container ID by removing the index portion from the task ID.
 * 3. Iterates through all subtasks within the container to update their status
 *    (1 for checked, 0 for unchecked) and stores the statuses in an array.
 * 4. Calls `addSubtasksStatus` to save the updated statuses for the container.
 * 5. Calls `reloadBoardContent` to refresh the board display.
 */
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const taskId = checkbox.id;
  const index = checkbox.getAttribute("data-index");
  const containerId = taskId.slice(0, -index.length);
  const subtasks = document.querySelectorAll(`#subtaskContainer${containerId} input[type="checkbox"]`);
  let subtasksStatus = [];
  subtasks.forEach((subtask, idx) => {
    const status = subtask.checked ? 1 : 0;
    subtask.setAttribute("data-status", status);
    subtasksStatus.push(status);
  });
  addSubtasksStatus(containerId, subtasksStatus);
  reloadBoardContent();
}

async function addSubtasksStatus(key, status) {
  try {
    await postToDatabase(key, "/subtasksStatus", status);
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
}

/**
 * The function closeModal closes a modal dialog and reloads the window when triggered by a specific
 * event or element.
 * @param [event=null] - The `event` parameter in the `closeModal` function is used to pass an event
 * object, which can be used to determine the source of the event that triggered the modal closure.
 * This allows the function to check if the modal should be closed based on the event target, such as
 * clicking on the
 */
function closeModal(event) {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");

  if (event && event.target.closest(".modalCloseButton")) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");
    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
      backdrop.classList.remove("show");
    }, 500);
  } else {
    reloadBoardContent();
  }
}

/**
 * Closes the task summary modal and its backdrop after a delete action.
 *
 * This function hides the modal and backdrop elements by adding the "hide" class
 * and setting their visibility to "hidden". It also removes the "show" class
 * from these elements to ensure they are no longer displayed. Finally, it
 * triggers a reload of the board content to reflect any changes made.
 *
 * @function
 */
function closeModalAfterDelete() {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");
  modal.classList.add("hide");
  backdrop.classList.add("hide");
  modal.style.visibility = "hidden";
  backdrop.style.visibility = "hidden";
  modal.classList.remove("show");
  backdrop.classList.remove("show");
  reloadBoardContent();
}

/**
 * The `deleteTask` function deletes a specific task from a Firebase database and updates the database
 * with the remaining tasks.
 * @param taskId - The `taskId` parameter in the `deleteTask` function represents the unique identifier
 * of the task that needs to be deleted from the Firebase database. This identifier is used to locate
 * the specific task within the list of tasks retrieved from Firebase and then remove it before
 * updating the database with the remaining tasks.
 */
async function deleteTask(taskId) {
  let allTasksFirebase = await getDataFromFireBase();
  let allTasksArray = Object.entries(allTasksFirebase).map(([key, value]) => ({
    ...value,
    firebaseId: key,
  }));
  let taskToDelete = allTasksArray.find((task) => task.firebaseId === taskId);
  if (taskToDelete) {
    allTasksArray = allTasksArray.filter((task) => task.firebaseId !== taskId);
  }
  let updatedTasks = allTasksArray.reduce((acc, task) => {
    const { firebaseId, ...taskData } = task;
    acc[firebaseId] = taskData;
    return acc;
  }, {});
  await postToDatabase("", "", updatedTasks);
  loadBoardContent();
  closeModalAfterDelete();
}

/**
 * Fetches data from a Firebase database at the specified path.
 *
 * @async
 * @function getDataFromFireBase
 * @param {string} [path=""] - The relative path within the "tasks" collection in the Firebase database.
 * @returns {Promise<Object>} A promise that resolves to the JSON-parsed response from the Firebase database.
 * @throws {Error} Throws an error if the fetch request fails or the response cannot be parsed as JSON.
 */
async function getDataFromFireBase(path = "") {
  let response = await fetch(BASE_URL + "tasks/" + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}
