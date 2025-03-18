BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [], subtasksStatus: [], categoryColor: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [], color: [] };

let currentDraggedElement;

/**
 * The `initi()` function asynchronously initializes the application by checking access authorization,
 * fetching tasks and contacts data, loading board content, and rendering the top bar.
 */
async function initi() {
  let checkedAuthority = await checkAccessAuthorization();
  if (checkedAuthority) {
    reloadBoardContent();
    renderTopBar();
  } else {
    window.location.href = "login.html";
  }
}

/**
 * Reloads the board content by fetching tasks and contacts data asynchronously
 * and then loading the board content.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the board content is successfully reloaded.
 */
async function reloadBoardContent() {
  allTasks = await getDataTasks();
  allContacts = await getDataContacts();
  loadBoardContent();
}

/**
 * The function `getDataTasks` retrieves data from a specified path `tasks`, processes and formats the
 * data, and returns an array of tasks.
 * @param [path] - The `path` parameter in the `getDataTasks` function is used to specify the path to
 * the JSON file containing tasks data. It is concatenated with the base URL and "tasks/" to form the
 * complete URL for fetching the data. If no path is provided, an empty string is used as the
 * @returns The `getDataTasks` function is returning an array of tasks with specific properties such as
 * id, assignedTo, color, category, createdAt, description, dueDate, priority, subtasks, title,
 * subtasksStatus, and status.
 */
async function getDataTasks(path = "") {
  let response = await fetch(BASE_URL + "tasks/" + path + ".json");
  let responseToJson = await response.json();
  let tasks = [];
  for (let key in responseToJson) {
    let task = responseToJson[key];
    tasks.push({
      id: key,
      assignedTo: determineAssignedTo(task.assignedContacts),
      color: determineColor(task.assignedContacts),
      category: task.category,
      createdAt: task.createdAt,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      subtasks: task.subtasks,
      title: task.title,
      subtasksStatus: task.subtasksStatus,
      status: determinStatus(key, task.status),
    });
  }
  return tasks;
}

/**
 * Determines the names of assigned contacts from an array of contact objects.
 *
 * @param {Array<{name: string}>} arryAssignedTo - An array of contact objects, each containing a `name` property.
 * @returns {string[]|undefined} An array of names of the assigned contacts, or `undefined` if the input is falsy.
 */
function determineAssignedTo(arryAssignedTo) {
  if (!arryAssignedTo) {
    return;
  } else {
    let assignedTo = arryAssignedTo.map((contact) => contact.name);
    return assignedTo;
  }
}

/**
 * Extracts and returns an array of colors from the provided array of assigned contacts.
 *
 * @param {Array<{color: string}>} arryAssignedColor - An array of objects, each containing a `color` property.
 * @returns {string[]|undefined} An array of color strings if `arryAssignedColor` is provided; otherwise, undefined.
 */
function determineColor(arryAssignedColor) {
  if (!arryAssignedColor) {
    return;
  } else {
    let assignedTo = arryAssignedColor.map((contact) => contact.color);
    return assignedTo;
  }
}

/**
 * Determines the status for a given key. If the status is null or undefined, 
 * it initializes the status to 1, adds it using the `addStatus` function, 
 * and returns the initialized status. Otherwise, it simply returns the provided status.
 *
 * @param {string} key - The unique identifier for which the status is being determined.
 * @param {number|null|undefined} status - The current status value, which can be null or undefined.
 * @returns {number} - The determined or provided status value.
 */
function determinStatus(key, status) {
  if (status === null || status === undefined) {
    status = 1;
    addStatus(key, status);
    return status;
  } else {
    return status;
  }
}

/**
 * Asynchronously adds or updates a status in the database for a given key.
 *
 * @async
 * @function
 * @param {string} key - The unique identifier for the database entry.
 * @param {string} status - The status value to be added or updated.
 * @throws {Error} Throws an error if the operation fails.
 */
async function addStatus(key, status) {
  try {
    await postToDatabase(key, "/status", status);
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
}

/**
 * Sends a PUT request to the specified database endpoint with the provided data.
 *
 * @async
 * @function postToDatabase
 * @param {string} [path1=""] - The first part of the path to append to the base URL.
 * @param {string} [path2=""] - The second part of the path to append to the base URL.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<void>} Resolves if the request is successful, otherwise logs an error to the console.
 * @throws {Error} Logs an error to the console if the fetch request fails.
 */
async function postToDatabase(path1 = "", path2 = "", data = {}) {
  const url = `${BASE_URL}tasks/${path1}${path2}.json`;
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return;
    }
  } catch (error) {
    console.error("Error posting:", error);
  }
}

/**
 * The function `getDataContacts` fetches contact data from a specified path `contacts` and generates an
 * abbreviation for each contact name using the `generateAbbreviation` function.
 * @param [path] - The `path` parameter in the `getDataContacts` function is used to specify the path
 * to the JSON file containing contact information. It is concatenated with the base URL and ".json" to
 * form the complete URL for fetching the data. If no `path` is provided, an empty string is used
 * @returns The `getDataContacts` function is returning an array of objects with the following
 * properties for each contact:
 * - idContact: the key of the contact in the response JSON
 * - contactName: the name of the contact from the response JSON
 * - contactAbbreviation: the abbreviation generated from the contact name using the
 * `generateAbbreviation` function
 * - color: the color of the contact from
 */
async function getDataContacts(path = "") {
  let response = await fetch(BASE_URL + "contacts/" + path + ".json");
  let responseToJson = await response.json();
  let contacts = [];
  for (let key in responseToJson) {
    let contact = responseToJson[key];
    contacts.push({
      idContact: key,
      contactName: contact.name,
      contactAbbreviation: generateAbbreviation(contact.name),
      color: contact.color,
    });
  }
  return contacts;
}

/**
 * Generates an abbreviation from a given name or object.
 *
 * If the input is an object, the function extracts the first key
 * and uses it as the name. If the input is a string, it splits the
 * string into words, takes the first character of each word, and
 * combines them into an abbreviation.
 *
 * @param {string|Object} newName - The input name as a string or an object.
 *                                  If an object is provided, the first key
 *                                  of the object is used as the name.
 * @returns {string} The generated abbreviation in uppercase.
 */
function generateAbbreviation(newName) {
  if (typeof newName === "object" && newName !== null) {
    newName = Object.keys(newName)[0];
  }
  let abbreviation = newName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  return abbreviation.toUpperCase();
}

/**
 * The above JavaScript functions are used to load and render task content on a board, including
 * determining priority, progress, completed subtasks, category color, and assigning tasks to users.
 * `renderTask` generates all individual tasks shown in the board.
 */
function loadBoardContent() {
  loadBordContentByStatus(0, "ToDoTaskContainer");
  loadBordContentByStatus(1, "ToDoTaskContainer");
  loadBordContentByStatus(2, "inProgressContainer");
  loadBordContentByStatus(3, "TestingContainer");
  loadBordContentByStatus(4, "doneContainer");
}

/**
 * Loads and displays tasks based on their status into a specified container.
 *
 * @param {string} status - The status of the tasks to filter (e.g., "in-progress", "completed").
 * @param {string} containerId - The ID of the HTML container where the tasks will be rendered.
 *
 * This function filters tasks from the global `allTasks` array based on the provided status.
 * If no tasks match the status, it displays a "no tasks left" message in the container.
 * Otherwise, it clears the container and renders each matching task using the `renderTask` function.
 */
function loadBordContentByStatus(status, containerId) {
  let tasks = allTasks.filter((t) => t["status"] === status);
  if (tasks.length === 0) {
    let container = document.getElementById(containerId);
    container.innerHTML = noTaskLeft();
  } else {
    let container = document.getElementById(containerId);
    container.innerHTML = "";
    tasks.forEach((task) => renderTask(task, container));
  }
}

/**
 * Renders a task into the specified container by generating its HTML representation
 * and injecting additional elements such as assignees and progress indicators.
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {string} task.id - The unique identifier for the task.
 * @param {string} task.priority - The priority level of the task (e.g., "high", "medium", "low").
 * @param {Array} [task.subtasks] - An optional array of subtasks associated with the task.
 * @param {Array} [task.subtasksStatus] - An optional array indicating the completion status of each subtask.
 * @param {string} task.category - The category of the task, used to determine its color.
 * @param {HTMLElement} container - The DOM element where the task will be rendered.
 */
function renderTask(task, container) {
  let priorityIcon = determinePriotiry(task.priority);
  let numberOfSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
  let progressOfProgressbar = determineProgress(numberOfSubtasks, task.subtasksStatus);
  let numberCompletetSubtasks = determineNumberCompletetSubtasks(task.subtasksStatus);
  let categoryColor = determineCategoryColor(task.category);
  container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar, numberCompletetSubtasks, categoryColor);
  if (!numberOfSubtasks) {
    document.getElementById(`progressContainer${task.id}`).style.display = "none";
  }
  injectAssignees(task);
}

/**
 * Determines the appropriate priority icon path based on the given priority level.
 * If no priority is provided, defaults to "medium".
 *
 * @param {string} priority - The priority level ("low", "medium", or "urgent").
 *                             Case-insensitive and leading/trailing spaces are ignored.
 * @returns {string} - The file path to the corresponding priority icon.
 */
function determinePriotiry(priority) {
  if (!priority) {
    priority = "medium";
  }
  priority = String(priority).toLowerCase().trim();
  priority = priority.toLowerCase();
  priority = priority.trim();
  if (priority === "low") {
    priority = "assets/icons/priority_low.svg";
  }
  if (priority === "medium") {
    priority = "assets/icons/priority_medium.svg";
  }
  if (priority === "urgent") {
    priority = "assets/icons/priority_high.svg";
  }
  return priority;
}

/**
 * Calculates the progress percentage based on the number of subtasks and their completion status.
 *
 * @param {number} numberOfSubtasks - The total number of subtasks.
 * @param {number[]} subtasksStatus - An array representing the status of each subtask, 
 *                                    where 1 indicates a completed subtask and other values indicate incomplete.
 * @returns {number} The progress percentage, rounded to the nearest whole number. 
 *                   Returns 0 if the subtasksStatus array is empty or not an array.
 */
function determineProgress(numberOfSubtasks, subtasksStatus) {
  if (!Array.isArray(subtasksStatus) || subtasksStatus.length === 0) {
    return 0;
  }
  const completedSubtasks = subtasksStatus.filter((status) => status === 1).length;
  const progressPercentage = (completedSubtasks / numberOfSubtasks) * 100;
  return Math.round(progressPercentage);
}

/**
 * Determines the number of completed subtasks from a given array of subtask statuses.
 *
 * @param {number[]} subtasksStatus - An array representing the statuses of subtasks, 
 *                                    where each status is a number (e.g., 1 for completed, 0 for not completed).
 * @returns {number} The count of completed subtasks. Returns 0 if the input is null or undefined.
 */
function determineNumberCompletetSubtasks(subtasksStatus) {
  if (!subtasksStatus) {
    return 0;
  }
  const completedSubtasks = subtasksStatus.filter((status) => status === 1).length;
  return completedSubtasks;
}

/**
 * Injects assignee information into the DOM for a given task.
 * This function dynamically updates the HTML content of an assignee container
 * by generating and appending visual representations (circles) for each assignee.
 *
 * @async
 * @function
 * @param {Object} task - The task object containing assignee and color information.
 * @param {number|string} task.id - The unique identifier of the task.
 * @param {Array<string>} task.assignedTo - An array of assignee names.
 * @param {Array<string>} task.color - An array of color strings corresponding to each assignee.
 * @throws {Error} Throws an error if the task object does not have valid `assignedTo` or `color` arrays.
 */
async function injectAssignees(task) {
  const assigneeContainer = document.getElementById(`assigneeContainer${task["id"]}`);
  assigneeContainer.innerHTML = "";
  if (Array.isArray(task.assignedTo) && Array.isArray(task.color)) {
    task.assignedTo.forEach((assignee, index) => {
      const assigneeAbbreviation = getAssigneeAbbreviation(assignee);
      const assigneeColor = task.color[index] || "rgba(0, 0, 0, 1)";
      assigneeContainer.innerHTML += generateAssigneeCircle(assigneeAbbreviation, assigneeColor);
    });
  }
}

/**
 * Generates an abbreviation from the given assignee's name.
 * The abbreviation is created by taking the first letter of each word in the name.
 *
 * @param {string} assignee - The full name of the assignee (e.g., "John Doe").
 * @returns {string|undefined} The abbreviation of the assignee's name (e.g., "JD"),
 * or `undefined` if no assignee is provided.
 */
function getAssigneeAbbreviation(assignee) {
  if (!assignee) {
    return;
  }
  return assignee
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

/**
 * The above JavaScript functions handle drag and drop functionality for tasks in different status
 * containers.
 * @param event - The `event` parameter in the `allowDrop` function is an event object that represents
 * the drop event. It is used to prevent the default behavior of the drop event using
 * `event.preventDefault()`.
 */
function allowDrop(event) {
  event.preventDefault();
  const containerIds = ["ToDoTaskContainer", "inProgressContainer", "TestingContainer", "doneContainer"];
  containerIds.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      const dashedBox = container.querySelector(".dashed-box");
      if (dashedBox) {
        const lastCard = container.querySelector(".listContainerContent:last-child");
        if (lastCard) {
          lastCard.insertAdjacentElement("afterend", dashedBox);
        }
        dashedBox.style.display = "block";
      }
    }
  });
}
