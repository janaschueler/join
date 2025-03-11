/**
 * The function `addSubtaskinEditModal` retrieves subtasks for a specific task and adds them to the
 * edit modal container.
 * @param id - The `id` parameter in the `addSubtaskinEditModal` function is used to identify the task
 * for which subtasks need to be added in the edit modal.
 * @returns If the `tasks` array is empty or if the `subTaskInput` is falsy, the function will return
 * early and not execute the rest of the code.
 */

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

/**
 * The function `handleButtonClick` determines whether to reset a button or add an additional subtask
 * in an edit modal based on the type of pointer event.
 * @param event - The `event` parameter in the `handleButtonClick` and
 * `addAdditionalSubtaskinEditModal` functions represents the event that occurred, such as a mouse
 * click or touch event. It contains information about the event, like the type of pointer used (mouse,
 * touch, pen) and allows you
 * @param id - The `id` parameter in the functions `handleButtonClick`,
 * `addAdditionalSubtaskinEditModal`, and `deleteSubtaskModal` is used to identify the specific task that the function is operating on. It helps in targeting and manipulating the correct
 * elements or data related to that particular
 */
function handleButtonClick(event, id) {
  if (["mouse", "touch", "pen"].includes(event.pointerType)) {
    resetButtonEdit(id);
  } else {
    addAdditionalSubtaskinEditModal(event, id);
  }
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

function deleteSubtaskModal(id) {
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
}

/**
 * The functions `transformButtonEdit` and `resetButtonEdit` manipulate the DOM to transform and reset
 * a button element respectively.
 * @param id - The `id` parameter in the `transformButtonEdit` and `resetButtonEdit` functions is used
 * to identify the specific element that needs to be transformed or reset. It is a unique identifier
 * that helps target the correct element in the DOM for manipulation.
 * @returns In the `transformButtonEdit` function, the `addtransformedButton` function is being called
 * and its return value is being used to replace the `outerHTML` of the `buttonContainer`.
 */
function transformButtonEdit(id) {
  const buttonContainer = document.querySelector("#iconAddButtonEdit");
  if (!buttonContainer) return;
  buttonContainer.outerHTML = addtransformedButton(id);
}

function resetButtonEdit(id) {
  const inputWrapper = document.getElementById("inputWrapperEdit");
  inputWrapper.innerHTML = returnTransformedButton(id);
}

/**
 * The functions `editSubtaskinModal` and `acceptEdit` are used to edit and accept changes to a subtask
 * in a modal window.
 * @param id - The `id` parameter in the `editSubtaskinModal` function and the `acceptEdit` function
 * refers to the unique identifier of the subtask that is being edited or accepted. This identifier is
 * used to target specific elements in the HTML document related to that particular subtask.
 * @param subTaskInput - Subtask input is the content of the subtask that needs to be edited or
 * updated.
 */
function editSubtaskinModal(id, subTaskInput) {
  let editSubtask = document.getElementById(`editSubTaskUnit${id}`);
  editSubtask.innerHTML = "";
  editSubtask.classList.add("editing");
  editSubtask.innerHTML = addInputFieldinModal(id, subTaskInput);
}

function acceptEdit(id) {
  let subTaskContainer = document.getElementById("editSubtasks-container");
  let newSubTask = document.getElementById(`inputSubtask${id}`).value;
  const removeSubtask = document.getElementById(`editSubTaskUnit${id}`);
  removeSubtask.remove();
  subTaskContainer.innerHTML += addSubtaskTemplateinModal(newSubTask, id);
}

/**
 * The `saveEditTask` function in JavaScript gathers task data, validates it, saves it to a server, and
 * handles any errors that may occur during the process.
 * @param id - The `id` parameter in the `saveEditTask` function represents the unique identifier of
 * the task that is being edited or updated. This identifier is used to specify which task should be
 * updated in the database.
 * @returns The `saveEditTask` function is an async function that saves edited task data. It gathers
 * task data using the `gatherTaskData` function, validates the data using the `validateTaskData`
 * function, and then saves the data using the `saveTaskData` function. If the data is successfully
 * saved, an alert message is shown, and the form is cleared. If there is an error
 */
async function saveEditTask(id) {
  const taskData = gatherTaskData();
  if (!validateTaskData(taskData)) return;

  try {
    await saveTaskData(id, taskData);
    alert("Task successfully created!");
    clearForm();
  } catch (error) {
    console.error("Error saving the task:", error);
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
    throw new Error(`Error while saving the task: ${response.status}`);
  }
}

/**
 * The functions above in the JavaScript code handle all aspects of the content selection process. Toggling contact selection, updating selected
 * contacts, filtering contacts, toggling dropdown visibility, and determining assigned contacts in an
 * edit modal.
 */

window.toggleContactSelectionEdit = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  const container = checkbox.closest(".customCheckboxContainer");
  const input = document.getElementById("search-contacts-edit");
  if (!checkbox) return;
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
};

// function handleCheckedState(contactId, contactName, contactColor, container, input) {
//   if (!selectedContacts.some((c) => c.id === contactId)) {
//     container.classList.add("checked");
//     selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
//     input.value = "";
//     filterContactsEdit();
//   }
// }

function handleUncheckedState(contactId, container) {
  container.classList.remove("checked");
  selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
}

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

window.toggleContactSelectionEditPreselected = function (contactId, contactName, contactColor) {
  const checkbox = document.getElementById(`edit-contact-${contactId}`);
  if (!checkbox) return;
  setTimeout(() => {
    const container = checkbox.closest(".customCheckboxContainer");
    const input = document.getElementById("search-contacts-edit");
    if (!checkbox.checked) {
      handlePreselectedState(contactId, contactName, contactColor, container, input, checkbox);
    }
    updateSelectedContactsEdit();
  }, 0);
};

function handlePreselectedState(contactId, contactName, contactColor, container, input, checkbox) {
  checkbox.checked = true;
  container.classList.add("checked");
  if (!selectedContacts.some((c) => c.id === contactId)) {
    selectedContacts.push({ id: contactId, name: contactName, color: contactColor });
  }
  input.value = "";
  filterContactsEdit();
}

/**
 * The function `openDatePickerModal` opens a date picker modal for the element with the ID
 * "due-date-edit".
 */
function openDatePickerModal() {
  let dateInput = document.getElementById("due-date-edit");
  dateInput.showPicker();
}

/**
 * The function `addTaskModal` in the JavaScript code snippet handles the addition and updating of
 * tasks by sending data to a server and redirecting to a board page upon successful save.
 * @param id - The `id` parameter in your functions represents the unique identifier of a task. It is
 * used to determine whether the task being modified is an existing task or a new task. If the `id` is
 * provided, it indicates an existing task is being edited, and if it is not provided, it
 * @param status - The `status` parameter in the `addTaskModal` and `addTaskModalNewTask` functions
 * represents the status of the task being added. It is used to determine the initial status of the
 * task, whether it's a new task or an existing task being updated. The status can be passed
 * @returns The `addTaskModal` function returns either `undefined` or nothing explicitly (implicit
 * return).
 */
async function addTaskModal(id, status) {
  if (!id) {
    addTaskModalNewTask(status);
    return;
  }
  const taskData = prepareTaskData(id, status);
  if (!taskData) {
    alert("Please fill in all required fields and select a priority.");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (response.ok) window.location.href = "board.html";
  } catch (error) {
    console.error("Error saving:", error);
  }
}

function prepareTaskData(id, status) {
  const title = document.getElementById("inputField").value.trim();
  const dueDate = document.getElementById("due-date-edit").value.trim();
  const category = determineCategory(id);
  const selectedPriority = determinePriority(id);
  if (!title || !dueDate || !category) return null;
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

function determinePriority() {
  const priorityButtons = document.querySelectorAll(".priority button");
  for (let button of priorityButtons) {
    const backgroundColor = window.getComputedStyle(button).backgroundColor;
    if (backgroundColor !== "rgb(255, 255, 255)") {
      console.log(button.classList);
      priority = String(button.classList).toLowerCase().trim();
      return priority;
    }
  }
  return "medium";
}

async function addTaskModalNewTask(status) {
  const taskData = prepareNewTaskData(status);
  if (!taskData) {
    alert("Please fill in all required fields and select a priority.");
    return;
  }
  await saveNewTask(taskData);
  window.location.href = "board.html";
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
    if (!response.ok) window.location.href = "board.html";
  } catch (error) {
    console.error("Error saving task:", error);
  }
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
