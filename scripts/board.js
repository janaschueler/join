BASE_URL = "https://join-ab0ac-default-rtdb.europe-west1.firebasedatabase.app/";

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
    console.log(assignedTo);
    return assignedTo;
  }
}

function determineColor(arryAssignedColor) {
  if (!arryAssignedColor) {
    return;
  } else {
    let assignedTo = arryAssignedColor.map((contact) => contact.color);
    console.log(assignedTo);
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
    } else {
      console.error("Fehler bei der Anfrage:", response.statusText);
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
      const assigneeColor = task.color[index] || "rgba(0, 0, 0, 1)"; // Fallback-Farbe falls nicht vorhanden

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
    let categoryColor = determineCategoryColor(task.category);
    summaryModal.innerHTML += generateTaskSummaryModal(task, priorityIcon, formatedDueDate, categoryColor);

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
      backdrop.classList.remove("show");
    }, 500); 
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

    const assigneeName = assignee ? assignee : "Unknown";

    const assigneeAbbreviation =
      typeof assigneeName === "string"
        ? assigneeName
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
        : "";

    const assingeeColor = tasks.color[indexAssingee];

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

// window.addEventListener("DOMContentLoaded", checkSreenSize);
// window.addEventListener("resize", checkSreenSize);

// function checkSreenSize(params) {
//   const modalEdit = document.getElementById("modalEditTask");
//   const isMobile = window.matchMedia("(max-width: 768px)").matches;

//   const isModalOpen = modalEdit.classList.contains("show");

//   if (isMobile && isModalOpen) {
//     modalEdit.style.display = "none";
//     window.location.href = "./add_Task.html";
//   } else if (!isMobile) {
//     modalEdit.style.display = "";
//   }
// }

// function openAddTask(statusTask) {
//   const showModalBackground = document.getElementById("addTaskSectionModal");
//   const showModal = document.getElementById("modalAddTask");

//   if (showModalBackground && showModal) {
//     showModalBackground.classList.add("show");
//     showModal.classList.add("show");
//     window.currentStatusTask = statusTask;
//   } else {
//     console.log("no modal found");
//   }
// }

function closeModalAddTask(event) {
  var modal = document.getElementById("modalEditTask");
  var backdrop = document.getElementById("editTaskSectionModal");

  if (!event || event.target === backdrop || event.target.classList.contains("ModalCloseButtonAddTask")) {
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

function handleButtonClick(status) {
  if (window.innerWidth <= 768) {
    window.location.href = "./add_Task.html";
  } else {
    openEditModal("", "", "", "", "", "", status);
  }
}

function openEditModal(categoryTask, title, description, dateTask, priorityTask, id, status) {
  const showModalBackground = document.getElementById("editTaskSectionModal");
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = "";

  if (showModalBackground && showModal) {
    showModalBackground.style.visibility = "visible";
    showModalBackground.classList.add("show"); 

    showModal.style.visibility = "visible";
    showModal.classList.add("show");  
  } else {
    console.log("no modal found");
  }

  if (!status) {
    status = 1;
  }

  if (!id) {
    buttonCopy = "Create Task";
    headline = "Add Task";
  } else {
    buttonCopy = "Ok";
    headline = "Edit Task";
  }

  // Inhalt des Modals setzen
  showModal.innerHTML = addEditTask(title, description, id, status, buttonCopy, headline);
  addSubtaskinEditModal(id);
  addDueDate(dateTask);
  populateAssignedToSelectEdit();
  initPriorityButtons(priorityTask);
  if (categoryTask) {
    selectCategory(categoryTask, 0);
  }
  determineAssignedToEditModal(id);
}


function addSubtaskinEditModal(id) {
  let subTaskContainer = document.getElementById("editSubtasks-container");

  let tasks = allTasks.filter((t) => t["id"] === id);
  if (tasks.length === 0) {
    return;
  }
  let subTaskInput = tasks[0].subtasks;

  if (!subTaskInput) {
    return;
  }

  subTaskInput.forEach((subTask, index) => {
    subTaskCount = index + 1;
    subTaskContainer.innerHTML += addSubtaskTemplateinModal(subTask, subTaskCount);
  });
}

function addAdditionalSubtaskinEditModal(id) {
  let subTaskInputRef = document.getElementById("new-subtask-input-Edit");
  let subTaskInput = subTaskInputRef.value.trim();
  let subTaskContainer = document.getElementById("editSubtasks-container");

  let tasks = allTasks.filter((t) => t["id"] === id);
  let numberOfSubTaskInput;

  if (!tasks[0]?.subtasks?.length) {
    numberOfSubTaskInput = 0;
  } else {
    numberOfSubTaskInput = tasks[0].subtasks.length;
  }

  subTaskCount = numberOfSubTaskInput + 1;

  subTaskContainer.innerHTML += addSubtaskTemplateinModal(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
}

function acceptEdit(id) {
  let subTaskContainer = document.getElementById("editSubtasks-container");
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;

  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();

  subTaskContainer.innerHTML += addSubtaskTemplateinModal(newSubTask, id);
}

function editSubtaskinModal(id, subTaskInput) {
  let editSubtask = document.getElementById(`editSubTaskUnit${id}`);
  editSubtask.innerHTML = "";
  editSubtask.classList.add("editing");
  editSubtask.innerHTML = addInputFieldinModal(id, subTaskInput);
}

async function saveEditTask(id) {
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;
  const assignedContacts = selectedContacts;
  const priority = selectedPriority;
  const status = determineStatusAddTask();

  if (!title || !description || !dueDate || !category || !priority) {
    alert("Bitte fülle alle Felder aus!");
    return;
  }

  const taskData = {
    title,
    description,
    dueDate,
    category,
    assignedContacts,
    priority,
    status,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`);
    }

    console.log("Aufgabe gespeichert:", await response.json());
    alert("Aufgabe erfolgreich erstellt!");
    clearForm();
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
  }
}

function addDueDate(dateTask) {
  let parts = dateTask.split("/");
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  let dueDateContainer = document.getElementById("due-date-edit");
  dueDateContainer.value = formattedDate;
}

function populateAssignedToSelectEdit() {
  const dropdown = document.getElementById("assigned-dropdown-Edit");
  if (!dropdown) return;

  dropdown.innerHTML = ""; // Zurücksetzen

  if (!allContacts || !Array.isArray(allContacts) || allContacts.length === 0) {
    console.warn("Contacts ist leer oder nicht definiert.");
    return;
  }

  allContacts.forEach((contact) => {
    console.log("Verarbeite Kontakt:", contact); // Debugging

    const label = document.createElement("label");
    label.classList.add("customCheckboxContainer");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("contact-checkbox");
    checkbox.id = `edit-contact-${contact.idContact}`;
    checkbox.name = `edit-contact-${contact.idContact}`;
    checkbox.value = contact.id;

    const customCheckbox = document.createElement("span");
    customCheckbox.classList.add("customCheckbox");

    const svgContainer = document.createElement("div");
    svgContainer.classList.add("svg-container");
    svgContainer.style.backgroundColor = contact.color;
    svgContainer.innerHTML = `<span class="contact-initials">${contact.contactAbbreviation}</span>`;

    const contactName = document.createElement("span");
    contactName.classList.add("subtasksUnit");
    contactName.textContent = contact.contactName;

    const contactRow = document.createElement("div");
    contactRow.classList.add("contact-row");
    contactRow.appendChild(svgContainer);
    contactRow.appendChild(contactName);
    contactRow.appendChild(customCheckbox);

    if (selectedContacts.some((c) => c.id === contact.idContact)) {
      checkbox.checked = true;
      label.classList.add("checked");
    }

    checkbox.addEventListener("change", function () {
      toggleContactSelectionEdit(contact.idContact, contact.contactName, contact.color);
    });

    label.appendChild(checkbox);
    label.appendChild(contactRow);
    dropdown.appendChild(label);
  });

  console.log("Funktion erfolgreich abgeschlossen!");
}

window.toggleContactSelectionEdit = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  if (!checkbox) return;

  setTimeout(() => {
    const container = checkbox.closest(".customCheckboxContainer");
    const input = document.getElementById("search-contacts-edit");

    if (checkbox.checked) {
      if (!selectedContacts.some((c) => c.id === contactId)) {
        container.classList.add("checked");
        selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
        input.value = "";
        filterContactsEdit();
      }
    } else {
      container.classList.remove("checked");
      selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
    }

    updateSelectedContactsEdit();
  }, 0);
};

window.toggleContactSelectionEditPreselected = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  if (!checkbox) return;

  setTimeout(() => {
    const container = checkbox.closest(".customCheckboxContainer");
    const input = document.getElementById("search-contacts-edit");

    if (!checkbox.checked) {
      checkbox.checked = true;
      container.classList.add("checked");

      if (!selectedContacts.some((c) => c.id === contactId)) {
        selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
      }

      input.value = "";
      filterContactsEdit();
    }

    updateSelectedContactsEdit();
  }, 0);
};

function updateSelectedContactsEdit() {
  const selectedContactsContainer = document.getElementById("selected-contacts-Edit");
  selectedContactsContainer.innerHTML = "";

  selectedContacts.forEach((contact) => {
    const contactElement = document.createElement("div");
    contactElement.classList.add("selected-contact");
    contactElement.style.backgroundColor = contact.color;

    contactElement.innerHTML = `
            <span class="selected-contact-initials">${getInitials(contact.name)}</span>`;

    selectedContactsContainer.appendChild(contactElement);
  });
}

function filterContactsEdit() {
  const searchTerm = document.getElementById("search-contacts-edit").value.toLowerCase();
  document.querySelectorAll(".customCheckboxContainer").forEach((label) => {
    const name = label.querySelector(".subtasksUnit").textContent.toLowerCase();
    label.style.display = name.includes(searchTerm) ? "flex" : "none";
  });
}

function toggleDropdownEdit(event) {
  event.stopPropagation();

  const dropdown = document.getElementById("assigned-dropdown-Edit");
  const iconDown = document.querySelector(".dropDown");
  const iconUp = document.querySelector(".dropDown-up");

  dropdown.classList.toggle("visible");

  if (dropdown.classList.contains("visible")) {
    iconDown.style.display = "none";
    iconUp.style.display = "block";
  } else {
    iconDown.style.display = "block";
    iconUp.style.display = "none";
  }
}

function determineAssignedToEditModal(id) {
  let task = allTasks.find((t) => t["id"] === id); // Gibt das erste gefundene Element zurück
  if (!task) return; // Falls keine Aufgabe gefunden wird, abbrechen

  task.assignedTo.forEach((assignedPerson, index) => {
    let color = task.color[index] || "#000000"; // Falls keine Farbe vorhanden, Standardfarbe setzen
    let foundContact = allContacts.find((contact) => contact.contactName === assignedPerson);
    if (foundContact) {
      toggleContactSelectionEditPreselected(foundContact.idContact, assignedPerson, color);
    }
  });
}

async function addTaskModal(id, status) {
  if (!id) {
    addTaskModalNewTask(status);
    return;
  }
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = document.getElementById("category").value;
  const assignedContacts = selectedContacts;

  if (!title || !dueDate || !category || !selectedPriority) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }

  const subtaskItems = document.querySelectorAll(".subtask-text");
  const subtasks = Array.from(subtaskItems).map((item) => item.textContent.trim());

  const taskData = {
    title,
    description,
    assignedContacts: assignedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks,
    createdAt: new Date().toISOString(),
    status: status,
  };

  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`);
    }

    console.log("✅ Aufgabe erfolgreich gespeichert:", await response.json());

    window.location.href = "board.html";
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    alert("Es gab einen Fehler beim Speichern der Aufgabe. Bitte prüfe die Konsole.");
  }
}

function openDatePickerModal() {
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}

async function addTaskModalNewTask(status) {
  const title = document.getElementById("inputField").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = document.getElementById("category").value;
  const assignedContacts = selectedContacts;

  if (!title || !dueDate || !category || !selectedPriority) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }

  const subtaskItems = document.querySelectorAll(".subtask-text");
  const subtasks = Array.from(subtaskItems).map((item) => item.textContent.trim());

  const taskData = {
    title,
    description,
    assignedContacts: assignedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks,
    createdAt: new Date().toISOString(),
    status: status,
  };

  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`);
    }

    console.log("✅ Aufgabe erfolgreich gespeichert:", await response.json());

    window.location.href = "board.html";
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
    alert("Es gab einen Fehler beim Speichern der Aufgabe. Bitte prüfe die Konsole.");
  }
}

function openDatePickerModal() {
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}
