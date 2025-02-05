const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [], contactColor: [] };

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
  console.log(tasks);
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
      contactColor: contact.contactColor,
    });
  }
  console.log(contacts);

  return contacts;
}

function generateAbbreviation(newName) {
  console.log(newName);

  if (typeof newName === "object" && newName !== null) {
    newName = Object.keys(newName)[0];
  }

  let abbreviation = newName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  console.log(abbreviation.toUpperCase());
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

function addStatus(key, status) {
  postToDatabase(key, "/status", status);
}

async function postToDatabase(path1 = "", path2 = "", data = {}) {
  const url = `${BASE_URL}tasks/${path1}${path2}.json`;
  console.log("URL:", url);
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
  if (priority === "low") {
    priority = "./assets/icons/priority_low.svg";
  }
  if (priority === "medium") {
    priority = "./assets/icons/priority_medium.svg";
  }
  if (priority === "high") {
    priority = "./assets/icons/priority_high.svg";
  }
  return priority;
}

async function injectAssignees(task) {
  const assigneeContainer = document.getElementById(`assigneeContainer${task["id"]}`);
  assigneeContainer.innerHTML = "";

  for (let indexAssingee = 0; indexAssingee < Object.keys(task.assignedTo).length; indexAssingee++) {
    const assignee = Object.keys(task.assignedTo)[indexAssingee];
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
    return allContacts[index].contactColor;
  } else {
    console.log("Kontaktname nicht gefunden");
    return null;
  }
}
