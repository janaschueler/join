let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [], categoryColor: [] };
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
  let progressOfProgressbar = determineProgress(task, task.status, numberOfSubtasks);

  container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar);

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

function determineProgress(status, numberOfSubtasks) {
  let statusProgress;
  if (status == 4) {
    return 100;
  } else {
  }
}

async function injectAssignees(task) {
  const assigneeContainer = document.getElementById(`assigneeContainer${task["id"]}`);
  assigneeContainer.innerHTML = "";

  const assigneeList = getAssigneeList(task.assignedTo);

  assigneeList.forEach((assignee) => {
    const assigneeAbbreviation = getAssigneeAbbreviation(assignee);
    const assingeeColor = findContactColor(assignee);
    assigneeContainer.innerHTML += generateAssigneeCircle(assigneeAbbreviation, assingeeColor);
  });
}

function getAssigneeList(assignedTo) {
  if (typeof assignedTo === "string") {
    return [assignedTo];
  }
  if (typeof assignedTo === "object") {
    return Object.keys(assignedTo);
  }
  return [];
}

function getAssigneeAbbreviation(assignee) {
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

    let task = tasks[0];
    let formatedDueDate = convertTask(task.dueDate);
    let priorityIcon = determinePriotiry(task.priority);
    summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formatedDueDate);

    injectAssigneeContacts(task);
    injectSubtasks(task);

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
  }
}



async function injectAssigneeContacts(tasks) {
  const assigneeContainer = document.getElementById(`assigneeListModal${tasks["id"]}`);
  assigneeContainer.innerHTML = "";

  let assigneeList = [];

  if (typeof tasks.assignedTo === "string") {
    assigneeList = [tasks.assignedTo];
  } else if (typeof tasks.assignedTo === "object") {
    assigneeList = Object.keys(tasks.assignedTo);
  }

  for (let indexAssingee = 0; indexAssingee < assigneeList.length; indexAssingee++) {
    const assignee = assigneeList[indexAssingee];
    const assigneeAbbreviation = assignee
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    const assingeeColor = findContactColor(assignee);

    assigneeContainer.innerHTML += generateAssigneeComntacts(assigneeAbbreviation, assingeeColor, assignee);
  }
}

async function injectSubtasks(tasks) {
  const subtaskContainer = document.getElementById(`subtaskContainer${tasks["id"]}`);
  subtaskContainer.innerHTML = "";

  if (typeof tasks.subtasks === "string") {
    tasks.subtasks = [tasks.assignedTo];
  } else if (typeof tasks.subtasks === "object") {
    tasks.subtasks = Object.keys(tasks.subtasks);
  } else if (!tasks.subtasks) {
    tasks.subtasks = 0;
  }

  for (let indexSubtask = 0; indexSubtask < tasks.subtasks.length; indexSubtask++) {
    const subtask = tasks.subtasks;

    subtaskContainer.innerHTML += generateSubtasks(tasks, subtask);
  }
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
