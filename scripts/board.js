BASE_URL = "https://join2-72adb-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = { id: [], assignedTo: [], category: [], createdAt: [], description: [], dueDate: [], priority: [], subtasks: [], title: [], status: [], subtasksStatus: [], categoryColor: [] };
let allContacts = { idContact: [], contactName: [], contactAbbreviation: [], color: [] };

let currentDraggedElement;

async function initi() {
  checkAccessAuthorization()
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
    }
  } catch (error) {
    console.error("Fehler beim Posten:", error);
  }
}

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
    return null;
  }
}

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
  const task = Object.values(allTasks).find((t) => t.id === currentDraggedElement);
  task.status = status;
  const container = document.getElementById(getContainerIdByStatus(status));
  const dashedBox = container.querySelector(".dashed-box");
  const rotatingElement = document.querySelector(`[onclick="openModal('${currentDraggedElement}')"]`);
  if (rotatingElement) {
    rotatingElement.classList.remove("rotating");
  }
  try {
    await addStatus(currentDraggedElement, status);
    if (dashedBox) {
      dashedBox.style.display = "none";
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Status:", error);
    return;
  }
  location.reload(true);
}

function startDragging(id) {
  currentDraggedElement = id;

  const element = document.querySelector(`[onclick="openModal('${id}')"]`);
  if (element) {
    element.classList.add("rotating");
  }
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
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

function toggleProgressContainer(task) {
  const progressContainerId = `progressContainer${task.id}`;
  if (!task.subtasks?.length) {
    const progressContainerElement = document.getElementById(progressContainerId);
    if (progressContainerElement) progressContainerElement.style.display = "none";
    else console.warn(`Element mit ID ${progressContainerId} nicht gefunden.`);
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

    let task = allTasks.find((t) => t.id === id);
    if (!task) return reject("Task not found");

    renderTaskSummaryContent(summaryModal, task);
    handleTaskVisibility(task);
    setTimeout(resolve, 0);
  });
}

function renderTaskSummaryContent(summaryModal, task) {
  let formattedDate = convertTask(task.dueDate);
  let priorityIcon = determinePriotiry(task.priority);
  let categoryColor = determineCategoryColor(task.category);
  summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formattedDate, categoryColor);
}

function handleTaskVisibility(task) {
  task.assignedTo?.length ? injectAssigneeContacts(task) : hideElement(`assignedToContainer${task.id}`);
  task.subtasks?.length ? injectSubtasks(task) : hideElement(`subtaskContainer${task.id}`);
}

function hideElement(id) {
  let element = document.getElementById(id);
  if (element) element.style.display = "none";
}

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
      console.error("Fehler beim Laden des Inhalts:", error);
    });
}
