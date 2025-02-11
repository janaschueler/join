const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [], categoryColor: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [], color: [] };

let currentDraggedElement;

async function inti() {
  allTasks = await getDataTasks();
  allContacts = await getDataContacts();
  loadBoardContent();
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
    console.log("Status erfolgreich gesetzt");
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
      console.log("Daten erfolgreich gesendet!");
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

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    let priority = task.priority;
    let priorityIcon = determinePriotiry(priority);
    numberOfSubtasks = task.subtasks.length;
    progressOfProgressbar = 50;

    container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar);
    // if (numberOfSubtasks == null ||numberOfSubtasks == undefined ) {}
    // document.getElementById("progressContainer").addClasslist("d-none")

    injectAssignees(task);
  }
}

function determinePriotiry(priority) {
  priority = priority.toLowerCase();
  priority = priority.trim();

  if (priority === "low") {
    priority = "./assets/icons/priority_low.svg";
  }
  if (priority === "medium") {
    priority = "./assets/icons/priority_medium.svg";
  }
  if (priority === "urgent") {
    priority = "./assets/icons/priority_high.svg";
  }
  return priority;
}

async function injectAssignees(task) {
  const assigneeContainer = document.getElementById(`assigneeContainer${task["id"]}`);
  assigneeContainer.innerHTML = "";

  let assigneeList = [];

  if (typeof task.assignedTo === "string") {
    assigneeList = [task.assignedTo];
  } else if (typeof task.assignedTo === "object") {
    assigneeList = Object.keys(tasks.assignedTo);
  }

  for (let indexAssingee = 0; indexAssingee < assigneeList.length; indexAssingee++) {
    const assignee = assigneeList[indexAssingee];
    const assigneeAbbreviation = assignee
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    const assingeeColor = findContactColor(assignee);

    assigneeContainer.innerHTML += generateAssigneeCircle(assigneeAbbreviation, assingeeColor);
  }
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

  searchTasks(searchInput.value); // Ruft die searchTasks-Funktion mit dem Suchinput auf
});

function searchTasks(searchInput) {
  let toDoContainer = document.getElementById("ToDoTaskContainer");
  let inProgressContainer = document.getElementById("inProgressContainer");
  let testingContainer = document.getElementById("TestingContainer");
  let doneContainer = document.getElementById("doneContainer");

  toDoContainer.innerHTML = "";
  inProgressContainer.innerHTML = "";
  testingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const filteredTasks = allTasks.filter((task) => task.title && task.title.toLowerCase().includes(searchInput.toLowerCase()));

  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task) => {
      let containerId;
      switch (task.status) {
        case 1:
          containerId = "ToDoTaskContainer";
          break;
        case 2:
          containerId = "inProgressContainer";
          break;
        case 3:
          containerId = "TestingContainer";
          break;
        case 4:
          containerId = "doneContainer";
          break;
        default:
          console.error("Ungültiger Status:", task.status);
          return;
      }

      let container = document.getElementById(containerId);
      let priority = task.priority;
      let priorityIcon = determinePriotiry(priority);
      let numberOfSubtasks = task.subtasks ? task.subtasks.length : 0;
      let progressOfProgressbar = 50;

      container.innerHTML += generateToDoHTML(task, priorityIcon, numberOfSubtasks, progressOfProgressbar);

      injectAssignees(task);
    });
  } else {
    console.log("Keine Ergebnisse für die Suche gefunden.");
  }
}

function closeModal() {
  document.getElementById("taskSummaryModal").style.display = "none";
}

function openModal(id) {
  document.getElementById("taskSummaryModal").style.display = "block";
  loadTaskSummaryModal(id);
}

function loadTaskSummaryModal(id) {
  let summaryModal = document.getElementById("taskSummaryModal");
  summaryModal.innerHTML = "";

  let tasks = allTasks.filter((t) => t["id"] === id);

  if (tasks.length === 0) {
    return;
  }
  let taskModal = document.getElementById("taskSummaryModal");
  taskModal.innerHTML = "";

  let task = tasks[0];
  let priority = task.priority;
  let priorityIcon = determinePriotiry(priority);
  summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon);

  injectAssigneeComntacts(task);
  injectSubtasks(task);
}

async function injectAssigneeComntacts(tasks) {
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
    tasks.subtasks = [tasks.subtasks];
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
  loadBoardContent()
  closeModal();
}
