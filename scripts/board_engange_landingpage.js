/**
 * Handles the drag event for an element.
 * This function is triggered when a draggable element is being dragged.
 * It sets the data to be transferred during the drag-and-drop operation.
 *
 * @param {DragEvent} ev - The drag event object.
 * @property {DataTransfer} ev.dataTransfer - The data transfer object associated with the drag event.
 * @property {string} ev.target.id - The ID of the element being dragged.
 */
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * Handles the drop event for a task, updating its status and refreshing the UI.
 *
 * @async
 * @function drop
 * @param {string} status - The new status to assign to the task (e.g., "in-progress", "done").
 * @returns {Promise<void>} A promise that resolves when the UI has been updated and the board content reloaded.
 */
async function drop(status) {
  const task = getTaskAndUpdateStatus(status);
  await updateUIAfterStatusChange(task, status);
  reloadBoardContent();
}

/**
 * Updates the status of a task based on the provided status and returns the updated task.
 * The task is identified by the `currentDraggedElement` ID. If a corresponding DOM element
 * with an `onclick` attribute matching the task ID exists, its "rotating" class is removed.
 *
 * @param {string} status - The new status to assign to the task.
 * @returns {Object|undefined} The updated task object, or `undefined` if no matching task is found.
 */
function getTaskAndUpdateStatus(status) {
  const task = Object.values(allTasks).find((t) => t.id === currentDraggedElement);
  task.status = status;
  const rotatingElement = document.querySelector(`[onclick="openModal('${currentDraggedElement}')"]`);
  if (rotatingElement) rotatingElement.classList.remove("rotating");
  return task;
}

/**
 * Updates the UI after a task's status has been changed.
 *
 * This function moves the task to the appropriate container based on its new status,
 * removes the old task element from the DOM, and hides the dashed drop zone if present.
 *
 * @async
 * @function
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} status - The new status of the task (e.g., "in-progress", "completed").
 * @returns {Promise<void>} Resolves when the UI update and status change are complete.
 * @throws {Error} Logs an error to the console if the status update fails.
 */
async function updateUIAfterStatusChange(task, status) {
  const container = document.getElementById(getContainerIdByStatus(status));
  const dashedBox = container.querySelector(".dashed-box");
  try {
    await addStatus(task.id, status);
    const oldTaskElement = document.getElementById(task.id);
    if (oldTaskElement) {
      oldTaskElement.remove();
    }
    if (dashedBox) dashedBox.style.display = "none"; // Die Drop-Zone verstecken
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

/**
 * Initiates the dragging process for a specified element by its ID.
 * Sets the `currentDraggedElement` to the provided ID and applies a "rotating"
 * CSS class to the element associated with the given ID, if it exists.
 *
 * @param {string} id - The unique identifier of the element to be dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
  const element = document.querySelector(`[onclick="openModal('${id}')"]`);
  if (element) {
    element.classList.add("rotating");
  }
}

/**
 * Retrieves the value from the input element with the ID "searchInput",
 * trims any leading or trailing whitespace, and converts it to lowercase.
 *
 * @constant {string} searchInput - The processed input value from the search field.
 */

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submitted");
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  searchTasks(searchInput);
});

/**
 * Filters and displays tasks based on the provided search input.
 * Clears the content of task containers before rendering the filtered tasks.
 * If no search input is provided, all tasks are displayed.
 *
 * @param {string} searchInput - The search term used to filter tasks.
 *                               If empty or null, all tasks are displayed.
 *
 * The function performs the following steps:
 * 1. Clears the content of task containers: "ToDoTaskContainer", "inProgressContainer",
 *    "TestingContainer", and "doneContainer".
 * 2. If no search input is provided, it renders all tasks by their status.
 * 3. If a search input is provided, it filters tasks based on whether the search term
 *    is found in the task's title or description (case-insensitive).
 * 4. Renders the filtered tasks by their status if any match the search criteria.
 */
function searchTasks(searchInput) {
  ["ToDoTaskContainer", "inProgressContainer", "TestingContainer", "doneContainer"].forEach((id) => {
    document.getElementById(id).innerHTML = "";
  });
  if (!searchInput) {
    allTasks.forEach((task) => renderTaskByStatus(task));
    return;
  }
  const filteredTasks = allTasks.filter((task) => {
    const titleMatches = task.title?.toLowerCase().includes(searchInput);
    const descriptionMatches = task.description?.toLowerCase().includes(searchInput);
    return titleMatches || descriptionMatches;
  });
  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task) => renderTaskByStatus(task));
  }
}

/**
 * Renders a task in the appropriate container based on its status.
 *
 * @param {Object} task - The task object to be rendered.
 * @param {string} task.status - The status of the task, used to determine the container.
 * @param {string} task.priority - The priority level of the task.
 * @param {Array} [task.subtasks] - An optional array of subtasks associated with the task.
 * @param {Array} [task.subtasksStatus] - An optional array of statuses for each subtask.
 * @param {string} task.category - The category of the task, used to determine its color.
 *
 * @throws Will log an error to the console if the task status is invalid.
 *
 * @description
 * This function determines the appropriate container for the task based on its status,
 * calculates various task-related properties (e.g., priority icon, number of subtasks,
 * progress bar progress, completed subtasks, and category color), and injects the task's
 * HTML into the container. It also handles rendering the assignees and toggling the
 * progress container visibility.
 */
function renderTaskByStatus(task) {
  const containerId = getContainerIdByStatus(task.status);
  if (!containerId) return console.error("Ungültiger Status:", task.status);
  const container = document.getElementById(containerId);
  const priorityIcon = determinePriotiry(task.priority);
  const numberOfSubtasks = task.subtasks ? task.subtasks.length : 0;
  const progressOfProgressbar = 50;
  const numberCompletetSubtasks = determineNumberCompletetSubtasks(task.subtasksStatus);
  const categoryColor = determineCategoryColor(task.category);
  container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar, numberCompletetSubtasks, categoryColor);
  injectAssignees(task);
  toggleProgressContainer(task);
}

/**
 * Retrieves the container ID corresponding to a given task status.
 *
 * @param {number} status - The status of the task. Expected values are:
 *   1: To-Do
 *   2: In Progress
 *   3: Testing
 *   4: Done
 * @returns {string|null} The ID of the container associated with the given status,
 *   or `null` if the status does not match any predefined values.
 */
function getContainerIdByStatus(status) {
  switch (status) {
    case 1:
      return "ToDoTaskContainer";
    case 2:
      return "inProgressContainer";
    case 3:
      return "TestingContainer";
    case 4:
      return "doneContainer";
    default:
      return null;
  }
}

/**
 * Toggles the visibility of the progress container for a given task.
 * If the task has no subtasks, the progress container element associated
 * with the task will be hidden by setting its display style to "none".
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {number|string} task.id - The unique identifier of the task.
 * @param {Array} [task.subtasks] - An optional array of subtasks associated with the task.
 */
function toggleProgressContainer(task) {
  const progressContainerId = `progressContainer${task.id}`;
  if (!task.subtasks?.length) {
    const progressContainerElement = document.getElementById(progressContainerId);
    if (progressContainerElement) progressContainerElement.style.display = "none";
  }
}

/**
 * The function `addStatusBoard` asynchronously posts a status to a database and reloads the window
 * upon completion.
 * @param key - The `key` parameter is a unique identifier. It is used to locate the specific data that needs
 * to be updated with the new status information.
 * @param status - The `status` parameter in the `addStatusBoard` function represents one of tbe four status in the board.
 * It is the data that will be sent to the database endpoint `/status` using the `postToDatabase` function.
 * @param event - The `event` parameter in the `addStatusBoard` function is an event object that is
 * passed to the function when it is called. It is used to handle events in the browser, such as click
 * events or form submissions. In this case, the `event.stopPropagation(event)` method is being called
 */
async function addStatusBoard(key, status, event) {
  event.stopPropagation(event);
  try {
    await postToDatabase(key, "/status", status);
    reloadBoardContent();
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
}
