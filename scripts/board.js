let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [], subtasksStatus: [], categoryColor: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [], color: [] };

let currentDraggedElement;

async function inti() {
  allTasks = await getDataTasks();
  allContacts = await getDataContacts();
  loadBoardContent();
  renderTopBar();
}

async function getDataTasks(path = "") {
  let response = await fetch(BASE_URL + "tasks/" + path + ".json");
  let responseToJson = await response.json();

  let tasks = [];

  for (let key in responseToJson) {
    let task = responseToJson[key];

    tasks.push({
      id: key,
      assignedTo: task.assignedTo,
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
    console.error("Fehler beim Setzen des Status:", error);
    throw error;
  }
}

async function addSubtasksStatus(key, status) {
  try {
    await postToDatabase(key, "/subtasksStatus", status);
  } catch (error) {
    console.error("Fehler beim Setzen des Status:", error);
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
    } else {
      console.error("Fehler bei der Anfrage:", response.statusText);
    }
  } catch (error) {
    console.error("Fehler beim Posten:", error);
  }
}

function loadBoardContent() {
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

  container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar, numberCompletetSubtasks);

  if (!numberOfSubtasks) {
    document.getElementById(`progressContainer${task.id}`).style.display = "none";
  }
  injectAssignees(task);
}

function determinePriotiry(priority) {
  priority = priority.toLowerCase();
  priority = priority.trim();

  if (priority === "low") {
    priority = "../assets/icons/priority_low.svg";
  }
  if (priority === "medium") {
    priority = "../assets/icons/priority_medium.svg";
  }
  if (priority === "urgent") {
    priority = "../assets/icons/priority_high.svg";
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
    return;
  }
  const completedSubtasks = subtasksStatus.filter((status) => status === 1).length;

  return completedSubtasks;
}

async function injectAssignees(task) {
  const assigneeContainer = document.getElementById(`assigneeContainer${task["id"]}`);
  assigneeContainer.innerHTML = "";

  if (Array.isArray(task.assignedTo)) {
    task.assignedTo.forEach((assignee) => {
      const assigneeAbbreviation = getAssigneeAbbreviation(assignee.name);
      const assigneeColor = assignee.color || "defaultColor";
      assigneeContainer.innerHTML += generateAssigneeCircle(assigneeAbbreviation, assigneeColor);
    });
  } else {
    return;
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

function findContactColor(name) {
  let contactNames = allContacts.map((contact) => contact.contactName);
  const index = contactNames.indexOf(name);

  if (index !== -1) {
    return allContacts[index].color;
  } else {
    console.log("Kontaktname nicht gefunden");
    return null;
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(status) {
  const task = Object.values(allTasks).find((t) => t.id === currentDraggedElement);
  task.status = status;

  try {
    await addStatus(currentDraggedElement, status);
  } catch (error) {
    return;
  }
  location.reload(true);
}

function startDragging(id) {
  currentDraggedElement = id;
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const searchInput = document.getElementById("searchInput");
  const searchMessageContainer = document.getElementById("searchMessageContainer");

  searchTasks(searchInput.value);
});

function searchTasks(searchInput) {
  ["ToDoTaskContainer", "inProgressContainer", "TestingContainer", "doneContainer"].forEach((id) => {
    document.getElementById(id).innerHTML = "";
  });

  const filteredTasks = allTasks.filter((task) => task.title && task.title.toLowerCase().includes(searchInput.toLowerCase()));

  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task) => renderTaskByStatus(task));
  } else {
    console.log("Keine Ergebnisse für die Suche gefunden.");
  }
}

function renderTaskByStatus(task) {
  const containerId = getContainerIdByStatus(task.status);
  if (!containerId) {
    console.error("Ungültiger Status:", task.status);
    return;
  }

  const container = document.getElementById(containerId);
  const priority = task.priority;
  const priorityIcon = determinePriotiry(priority);
  const numberOfSubtasks = task.subtasks ? task.subtasks.length : 0;
  const progressOfProgressbar = 50;

  container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar);
  injectAssignees(task);

  if (!numberOfSubtasks) {
    const progressElement = document.getElementById(progressContainer(task.id));
    progressElement.style.display = "none";
  }
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

function loadTaskSummaryModal(id) {
  return new Promise((resolve, reject) => {
    let summaryModal = document.getElementById("taskSummaryModal");
    summaryModal.innerHTML = "";

    let tasks = allTasks.filter((t) => t["id"] === id);

    if (tasks.length === 0) {
      reject("Task not found");
      return;
    }

    let task = tasks[0];
    let formatedDueDate = convertTask(task.dueDate);
    let priorityIcon = determinePriotiry(task.priority);
    summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formatedDueDate);

    // Überprüfen, ob "assignedTo" vorhanden ist und ggf. unsichtbar machen, wenn nicht
    if (task.assignedTo && task.assignedTo.length > 0) {
      injectAssigneeContacts(task);
    } else {
      let assignedToContainer = document.getElementById(`assignedToContainer${task.id}`);
      if (assignedToContainer) {
        assignedToContainer.style.display = "none"; // Setzt den Container auf unsichtbar
      }
    }

    // Überprüfen, ob "subtask" vorhanden ist und ggf. unsichtbar machen, wenn nicht
    if (task.subtasks && task.subtasks.length > 0) {
      injectSubtasks(task);
    } else {
      let subtaskContainer = document.getElementById(`subtaskContainer${task.id}`);
      if (subtaskContainer) {
        subtaskContainer.style.display = "none"; // Setzt den Container auf unsichtbar
      }
    }

    // Promise nach einer kurzen Verzögerung auflösen
    setTimeout(() => {
      resolve();
    }, 0);
  });
}

function openModal(id) {
  loadTaskSummaryModal(id)
    .then(() => {
      var modal = document.getElementById("modalTaskSummary");
      var backdrop = document.getElementById("taskSummaryModal");

      backdrop.style.visibility = "visible";
      backdrop.style.opacity = "1";

      modal.style.visibility = "visible";
      modal.classList.remove("hide");
      modal.classList.add("show");
    })
    .catch((error) => {
      console.error("Fehler beim Laden des Inhalts:", error);
    });
}

function closeModal(event) {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");

  if (!event || event.target === backdrop || event.target.classList.contains("ModalCloseButton")) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");

    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
    }, 500);
    location.reload();
  }
}

async function injectAssigneeContacts(tasks) {
  const assigneeContainer = document.getElementById(`assigneeListModal${tasks["id"]}`);
  assigneeContainer.innerHTML = "";

  let assigneeList = [];

  if (Array.isArray(tasks.assignedTo)) {
    assigneeList = tasks.assignedTo;
  } else if (typeof tasks.assignedTo === "string") {
    assigneeList = [tasks.assignedTo];
  } else if (typeof tasks.assignedTo === "object") {
    assigneeList = Object.keys(tasks.assignedTo);
  }

  for (let indexAssingee = 0; indexAssingee < assigneeList.length; indexAssingee++) {
    const assignee = assigneeList[indexAssingee];

    const assigneeName = assignee.name ? assignee.name : "Unknown";

    const assigneeAbbreviation =
      typeof assigneeName === "string"
        ? assigneeName
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
        : "";

    const assingeeColor = assignee.color;

    assigneeContainer.innerHTML += generateAssigneeComntacts(assigneeAbbreviation, assingeeColor, assigneeName);
  }
}

async function injectSubtasks(tasks) {
  const subtaskContainer = document.getElementById(`subtaskListModal${tasks["id"]}`);
  subtaskContainer.innerHTML = "";

  if (typeof tasks.subtasks === "string") {
    tasks.subtasks = [tasks.subtasks];
  } else if (!Array.isArray(tasks.subtasks)) {
    tasks.subtasks = [];
  }

  if (!Array.isArray(tasks.subtasksStatus)) {
    tasks.subtasksStatus = new Array(tasks.subtasks.length).fill(0);
  }

  for (let indexSubtask = 0; indexSubtask < tasks.subtasks.length; indexSubtask++) {
    const subtask = tasks.subtasks[indexSubtask];

    let statusCheckbox = tasks.subtasksStatus[indexSubtask] === 1;

    subtaskContainer.innerHTML += generateSubtasks(tasks, subtask, indexSubtask, statusCheckbox);
  }

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const isChecked = checkbox.checked;
  const taskId = checkbox.id;
  const index = checkbox.getAttribute("data-index");
  const containerId = taskId.slice(0, taskId.length - index.length);

  console.log(`Task ID: ${taskId}`);
  console.log(`Subtask Index: ${index}`);

  const subtasks = document.querySelectorAll(`#subtaskContainer${containerId} input[type="checkbox"]`);
  console.log("Subtasks:", subtasks);

  let subtasksStatus = [];

  subtasks.forEach((subtaskCheckbox, idx) => {
    const status = subtaskCheckbox.checked ? 1 : 0;
    console.log(`Subtask ${idx}: ${status}`);
    subtaskCheckbox.setAttribute("data-status", status);
    subtasksStatus.push(status);
  });

  console.log("Subtasks Status:", subtasksStatus);
  addSubtasksStatus(containerId, subtasksStatus);
}

function deleteTask(taskId) {
  let taskToDelete = allTasks.find((t) => t.id === taskId);

  if (taskToDelete) {
    const index = allTasks.indexOf(taskToDelete);
    allTasks.splice(index, 1);
  }

  postToDatabase("", "", allTasks);
  loadBoardContent();
  closeModal();
}

function convertTask(dueDate) {
  let formatedDueDate = new Intl.DateTimeFormat("en-Gb").format(new Date(dueDate));

  return formatedDueDate;
}
