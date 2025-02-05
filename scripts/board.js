const BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [] };

async function inti() {
  allTasks = await getDataTasks();
  allContacts = await getDataContacts();
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
      contactName: contact.contactName,
      contactAbbreviation: generateAbbreviation(contact.contactName),
      contactStatus: determinStatu(contact.contactStatus),
    });
  }
  console.log(contacts);

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
  console.log(abbreviation.toUpperCase());
  return abbreviation.toUpperCase();
}

function determinStatu(contactStatus) {
  if (contactStatus === null || contactStatus === undefined) {
    contactStatus = 1;
    return contactStatus;
  } else {
    return contactStatus;
  }
}

function loadBordcontent() {
  let toDo = allTasks.filter((t) => t["status"]) == "1";
  let toDoContainer = document.getElementById("ToDoTaskContainer");
  toDoContainer.innerHTML = "";

  for (let indexToDo = 0; Tasks < toDo.length; indexToDo++) {
    const allTodos = toDo[Tasks];

    toDoContainer.innerHTML += generateToDoHTML(allTodos);
  }
}
