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
  let task = allTasks.find((t) => t["id"] === id);
  if (!task) return;
  if (!task.assignedTo) return;
  task.assignedTo.forEach((assignedPerson, index) => {
    let color = task.color[index] || "#000000";
    let foundContact = allContacts.find((contact) => contact.contactName === assignedPerson);
    if (foundContact) {
      toggleContactSelectionEditPreselected(foundContact.idContact, assignedPerson, color);
    }
  });
}

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

async function addTaskModal(id, status) {
  if (!id) return addTaskModalNewTask(status);
  const taskData = prepareTaskData(id, status);
  if (!taskData) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error(`Fehler beim Speichern: ${response.status}`);
    window.location.href = "board.html";
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
  }
}

function prepareTaskData(id, status) {
  const title = document.getElementById("inputField").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = determineCategory(id);
  if (!title || !dueDate || !category || !selectedPriority) return null;
  return {
    title,
    description: document.getElementById("description").value.trim(),
    assignedContacts: selectedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks: Array.from(document.querySelectorAll(".subtask-text")).map((item) => item.textContent.trim()),
    createdAt: new Date().toISOString(),
    status,
  };
}

function determineCategory(id) {
  let formCategory = document.getElementById("category").value;
  if (formCategory) {
    return formCategory;
  } else {
    let task = allTasks.filter((t) => t["id"] === id);
    let category = task[0].category;
    return category;
  }
}

function openDatePickerModal() {
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}

async function addTaskModalNewTask(status) {
  const taskData = prepareNewTaskData(status);
  if (!taskData) {
    alert("Bitte alle Pflichtfelder ausfüllen und eine Priorität auswählen.");
    return;
  }
  await saveNewTask(taskData);
}

function prepareNewTaskData(status) {
  const title = document.getElementById("inputField").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = document.getElementById("category").value;
  if (!title || !dueDate || !category || !selectedPriority) return null;
  return {
    title,
    description: document.getElementById("description").value.trim(),
    assignedContacts: selectedContacts,
    dueDate,
    category,
    priority: selectedPriority,
    subtasks: Array.from(document.querySelectorAll(".subtask-text")).map((item) => item.textContent.trim()),
    createdAt: new Date().toISOString(),
    status,
  };
}

async function saveNewTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error(`Fehler beim Speichern: ${response.status}`);
    window.location.href = "board.html";
  } catch (error) {
    console.error("Fehler beim Speichern der Aufgabe:", error);
  }
}

function openDatePickerModal() {
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}

function transformButtonEdit(id) {
  const buttonContainer = document.querySelector("#iconAddButtonEdit");
  if (!buttonContainer) return;
  buttonContainer.outerHTML = addtransformedButton(id);
}

function resetButtonEdit(id) {
  const inputWrapper = document.getElementById("inputWrapperEdit");
  inputWrapper.innerHTML = returnTransformedButton(id);
}

function handleButtonClick(event, id) {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonEdit(id);
  } else {
    addAdditionalSubtaskinEditModal(event, id);
  }
}

function openStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "block";
  document.getElementById(`arrowUp${id}`).style.display = "none";
  document.getElementById(`arrowDown${id}`).style.display = "block";
}

function closeStatusNav(event, id) {
  event.stopPropagation(event);
  document.getElementById(`statusMenu${id}`).style.display = "none";
  document.getElementById(`arrowUp${id}`).style.display = "block";
  document.getElementById(`arrowDown${id}`).style.display = "none";
}

async function addStatusBoard(key, status, event) {
  event.stopPropagation(event);
  try {
    await postToDatabase(key, "/status", status);
  } catch (error) {
    console.error("Fehler beim Setzen des Status:", error);
    throw error;
  }
  window.location.reload();
}
