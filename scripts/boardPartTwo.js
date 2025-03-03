function closeModal(event) {
  if (!event) {
    return;
  }
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");
  if (!event || event.target === backdrop || event.target.classList.contains("modalCloseButton")) {
    modal.classList.add("hide");
    backdrop.classList.add("hide");
    setTimeout(function () {
      modal.style.visibility = "hidden";
      backdrop.style.visibility = "hidden";
      modal.classList.remove("show");
      backdrop.classList.remove("show");
    }, 500);
    window.location.reload();
  }
}

async function injectAssigneeContacts(task) {
  const assigneeContainer = document.getElementById(`assigneeListModal${task.id}`);
  assigneeContainer.innerHTML = "";
  let assigneeList = extractAssigneeList(task.assignedTo);
  assigneeList.forEach((assignee, index) => renderAssignee(assignee, task.color[index], assigneeContainer));
}

function extractAssigneeList(assignedTo) {
  if (Array.isArray(assignedTo)) return assignedTo;
  if (typeof assignedTo === "string") return [assignedTo];
  if (typeof assignedTo === "object") return Object.keys(assignedTo);
  return [];
}

function renderAssignee(assignee, color, container) {
  let name = assignee || "Unknown";
  let abbreviation = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  container.innerHTML += generateAssigneeComntacts(abbreviation, color, name);
}

async function injectSubtasks(task) {
  const subtaskContainer = document.getElementById(`subtaskListModal${task.id}`);
  subtaskContainer.innerHTML = "";
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [task.subtasks || []];
  const statuses = Array.isArray(task.subtasksStatus) ? task.subtasksStatus : new Array(subtasks.length).fill(0);
  subtasks.forEach((subtask, index) => {
    subtaskContainer.innerHTML += generateSubtasks(task, subtask, index, statuses[index] === 1);
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => cb.addEventListener("change", handleCheckboxChange));
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const taskId = checkbox.id;
  const index = checkbox.getAttribute("data-index");
  const containerId = taskId.slice(0, -index.length);
  const subtasks = document.querySelectorAll(`#subtaskContainer${containerId} input[type="checkbox"]`);
  let subtasksStatus = [];
  subtasks.forEach((subtask, idx) => {
    const status = subtask.checked ? 1 : 0;
    subtask.setAttribute("data-status", status);
    subtasksStatus.push(status);
  });
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

function deleteSubtaskModal(id) {
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
}

function convertTask(dueDate) {
  let formatedDueDate = new Intl.DateTimeFormat("en-Gb").format(new Date(dueDate));
  return formatedDueDate;
}

function closeModalAddTask(event) {
  if (!event) {
    return;
  }
  event.preventDefault();
  var modal = document.getElementById("modalEditTask");
  var backdrop = document.getElementById("editTaskSectionModal");
  if (!event || event.target === backdrop || event.target.classList.contains("secondaryButton-clear") || event.target.classList.contains("modalCloseButtonAddTask")) {
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
  closeSummaryModal();
  showModalVisibility();
  const buttonCopy = id ? "Ok" : "Create Task";
  const headline = id ? "Edit Task" : "Add Task";
  setModalContent(title, description, id, status || 1, buttonCopy, headline);
  initEditModal(id, dateTask, priorityTask, categoryTask);
}

function showModalVisibility() {
  const showModalBackground = document.getElementById("editTaskSectionModal");
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = "";
  if (showModalBackground && showModal) {
    showModalBackground.style.visibility = "visible";
    showModalBackground.classList.add("show");
    showModal.style.visibility = "visible";
    showModal.classList.add("show");
  }
}

function setModalContent(title, description, id, status, buttonCopy, headline) {
  const showModal = document.getElementById("modalEditTask");
  showModal.innerHTML = addEditTask(title, description, id, status, buttonCopy, headline);
}

function initEditModal(id, dateTask, priorityTask, categoryTask) {
  addSubtaskinEditModal(id);
  addDueDate(dateTask);
  populateAssignedToSelectEdit();
  initPriorityButtons(priorityTask);
  if (categoryTask) {
    document.getElementById("labelCategory").style.display = "none";
    document.getElementById("custom-category").style.display = "none";
    document.getElementById("buttonContainerEdit").style.marginTop = "32px";
    document.getElementById("modalEditTask").style.height = "750px";
    document.getElementById("divider").style.height = "350px";
  }
  determineAssignedToEditModal(id);
}

function closeSummaryModal() {
  var modal = document.getElementById("modalTaskSummary");
  var backdrop = document.getElementById("taskSummaryModal");
  if (modal && backdrop) {
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

function addAdditionalSubtaskinEditModal(event, id) {
  event.preventDefault();
  event.stopPropagation();
  let subTaskInputRef = document.getElementById("new-subtask-input-Edit");
  let subTaskInput = subTaskInputRef.value.trim();
  let subTaskContainer = document.getElementById("editSubtasks-container");
  if (!subTaskInput) {
    return;
  }

  let tasks = allTasks.filter((t) => t["id"] === id);
  let numberOfSubTaskInput = tasks[0]?.subtasks?.length || 0;
  let subTaskCount = numberOfSubTaskInput + 1;

  subTaskContainer.innerHTML += addSubtaskTemplateinModal(subTaskInput, subTaskCount);
  subTaskInputRef.value = "";
  resetButtonEdit(id);
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
  const taskData = gatherTaskData();
  if (!validateTaskData(taskData)) return;

  try {
    await saveTaskData(id, taskData);
    alert("Aufgabe erfolgreich erstellt!");
    clearForm();
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
  }
}

function gatherTaskData() {
  return {
    title: document.getElementById("inputField").value.trim(),
    description: document.getElementById("description").value.trim(),
    dueDate: document.getElementById("due-date").value,
    category: document.getElementById("category").value,
    assignedContacts: selectedContacts,
    priority: selectedPriority,
    status: determineStatusAddTask(),
    createdAt: new Date().toISOString(),
  };
}

function validateTaskData({ title, description, dueDate, category, priority }) {
  if (!title || !description || !dueDate || !category || !priority) {
    alert("Bitte fülle alle Felder aus!");
    return false;
  }
  return true;
}

async function saveTaskData(id, taskData) {
  const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`);
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

  dropdown.innerHTML = "";

  if (!allContacts || !Array.isArray(allContacts) || allContacts.length === 0) {
    console.warn("Contacts ist leer oder nicht definiert.");
    return;
  }

  allContacts.forEach((contact) => {
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
