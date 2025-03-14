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
function determineAssignedTo(arryAssignedTo) {
  if (!arryAssignedTo) {
    return;
  } else {
    let assignedTo = arryAssignedTo.map((contact) => contact.name);
    return assignedTo;
  }
}

function determineColor(arryAssignedColor) {
  if (!arryAssignedColor) {
    return;
  } else {
    let assignedTo = arryAssignedColor.map((contact) => contact.color);
    return assignedTo;
  }
}

function determinStatus(key, status) {
  if (status === null || status === undefined) {
    status = 1;
    addStatus(key, status);
    return status;
  } else {
    return status;
  }
}

async function addStatus(key, status) {
  try {
    await postToDatabase(key, "/status", status);
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
}

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

function loadBordContentByStatus(status, containerId) {
  let tasks = allTasks.filter((t) => t["status"] === status);
  if (tasks.length === 0) {
    return;
  }
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  tasks.forEach((task) => renderTask(task, container));
}

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

function determineProgress(numberOfSubtasks, subtasksStatus) {
  if (!Array.isArray(subtasksStatus) || subtasksStatus.length === 0) {
    return 0;
  }
  const completedSubtasks = subtasksStatus.filter((status) => status === 1).length;
  const progressPercentage = (completedSubtasks / numberOfSubtasks) * 100;
  return Math.round(progressPercentage);
}

function determineNumberCompletetSubtasks(subtasksStatus) {
  if (!subtasksStatus) {
    return 0;
  }
  const completedSubtasks = subtasksStatus.filter((status) => status === 1).length;
  return completedSubtasks;
}

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

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(status) {
  const task = getTaskAndUpdateStatus(status);
  await updateUIAfterStatusChange(task, status);
  location.reload(true);
}

function getTaskAndUpdateStatus(status) {
  const task = Object.values(allTasks).find((t) => t.id === currentDraggedElement);
  task.status = status;

  const rotatingElement = document.querySelector(`[onclick="openModal('${currentDraggedElement}')"]`);
  if (rotatingElement) rotatingElement.classList.remove("rotating");

  return task;
}

async function updateUIAfterStatusChange(task, status) {
  const container = document.getElementById(getContainerIdByStatus(status));
  const dashedBox = container.querySelector(".dashed-box");

  try {
    await addStatus(task.id, status);
    if (dashedBox) dashedBox.style.display = "none";
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

function startDragging(id) {
  currentDraggedElement = id;

  const element = document.querySelector(`[onclick="openModal('${id}')"]`);
  if (element) {
    element.classList.add("rotating");
  }
}

/**
 * The above JavaScript code defines functions to search and render tasks based on input, with a focus
 * on filtering and displaying tasks in different containers based on their status.
 * @param searchInput - The `searchInput` parameter in the `searchTasks` function is the user input
 * from the search form. It is the value entered by the user in the search input field, which is then
 * trimmed of any extra whitespace and converted to lowercase for case-insensitive comparison.
 * @returns The code snippet provided is an event listener that listens for a form submission on an
 * element with the id "searchForm". When the form is submitted, it prevents the default form
 * submission behavior, gets the value of the search input field, trims and converts it to lowercase,
 * and then calls the function `searchTasks(searchInput)` with the search input value as an argument.
 * Followed by `renderTaskByStatus(task)` which ultimately renders the filtered tasks back into the board.
 */
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submitted");
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  searchTasks(searchInput);
});

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
  } catch (error) {
    console.error("Error setting status:", error);
    throw error;
  }
  window.location.reload();
}
